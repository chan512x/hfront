import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import EnhancedInsights from "./EnhancedInsights"; 
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authcontext";
export default function Mpage() {
  const [data, setData] = useState(null);
  const [exceedingCategories, setExceedingCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [transformedData, setTransformedData] = useState([]);
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [insights, setInsights] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin"); // Redirect to Sign In page
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      if (!user) {
        alert("User not authenticated.");
        return;
      }
  
      const token = await user.getIdToken();
  
      const response = await axios.post("https://hback-1.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, 
        },
      });
  
      const parsedData = JSON.parse(response.data.act);
      console.log(parsedData);
      setData(parsedData);
      setExceedingCategories(response.data.exc);
      setInsights(response.data.gpt);
      setShowInsights(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  
  const addRow = () => {
    setEntries([...entries, { to: "", note: "", date: "", amount: "", type: "credit" }]);
  };

  const deleteRow = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updatedEntries = entries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setEntries(updatedEntries);
  };

  const handleSubmit = async () => {
    
      if (!user) {
        alert("User not authenticated.");
        return;
      }
  
      const token = await user.getIdToken();
    try {
      const response = await axios.post("https://hback-1.onrender.com/submit", entries, {
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 

         }
      });
      console.log("Response:", response.data);
      const parsedData = JSON.parse(response.data.act);
      console.log(parsedData);
      setData(parsedData);
      setExceedingCategories(response.data.exc);
      setInsights(response.data.gpt);
      setShowInsights(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data.");
    }
  };

  useEffect(() => {
    if (data?.pred) {
      const transformed = Object.entries(data.pred)
        .map(([category, value]) => ({
          name: category,
          value: value || 0, // Ensure no undefined values
        }))
        .filter(entry => entry.value > 0); // Remove zero-value categories

      setTransformedData(transformed);
    }
  }, [data]);

  const COLORS = ["#FF6B6B", "#6BFF95", "#6B8BFF", "#FFD166", "#8338EC", "#FF5A5F", "#06D6A0", "#118AB2"];

  return (
    <>
      {/* Header - matching the landing page */}
      <header className="bg-white border-b border-gray-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <div className="flex flex-row">
                <img className="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=500" alt="" />
                <span className="mt-1 font-bold text-gray-900 ml-1">Fin</span>
                <span className="mt-1 font-bold text-blue-700">Track</span>
              </div>
            </a>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" class="text-sm/6 font-semibold text-gray-900" onClick={handleLogout}>Log Out <span aria-hidden="true">&rarr;</span></a>
      </div>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!data ? (
          <div className="space-y-8">
            <div className="border border-blue-100 rounded-lg shadow-sm p-6 bg-white">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Upload CSV</h2>
              
              <div className="flex flex-col space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-blue-200 hover:border-blue-400"
                  }`}
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input 
                    ref={fileInputRef}
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept=".csv"
                  />
                  
                  <svg className="mx-auto h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  
                  <div className="mt-4 flex text-sm text-gray-600 justify-center">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      {isDragging ? "Drop file here" : "Click to upload"}
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  
                  {file && (
                    <div className="mt-2 flex items-center justify-center">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{file.name}</span>
                        <button 
                          className="ml-2 text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                        >
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 italic">
                    <svg className="inline-block h-4 w-4 mr-1 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Note: More data provides more accurate results and insights
                  </p>
                  
                  <button 
                    onClick={handleUpload} 
                    className={`bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors flex items-center
                      ${file ? "hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" : "opacity-50 cursor-not-allowed"}`}
                    disabled={!file}
                  >
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Upload & Analyze
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-blue-100 rounded-lg shadow-sm p-6 bg-white">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Manual Entry</h2>
              {!showForm ? (
                <button 
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center" 
                  onClick={() => setShowForm(true)}
                >
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Transactions
                </button>
              ) : (
                <div className="space-y-6">
                  {entries.length === 0 ? (
                    <div className="py-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="mt-2 text-gray-500">No entries added yet</p>
                      <button 
                        className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center mx-auto" 
                        onClick={addRow}
                      >
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add First Entry
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-50">
                          <tr>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">To</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Note</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Date</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Amount</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Type</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((entry, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-2 py-3">
                                <input 
                                  type="text" 
                                  placeholder="To" 
                                  value={entry.to} 
                                  onChange={(e) => handleChange(index, "to", e.target.value)} 
                                  className="w-full border border-gray-300 rounded-md py-1.5 px-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                />
                              </td>
                              <td className="px-2 py-3">
                                <input 
                                  type="text" 
                                  placeholder="Note" 
                                  value={entry.note} 
                                  onChange={(e) => handleChange(index, "note", e.target.value)} 
                                  className="w-full border border-gray-300 rounded-md py-1.5 px-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                />
                              </td>
                              <td className="px-2 py-3">
                                <input 
                                  type="date" 
                                  value={entry.date} 
                                  onChange={(e) => handleChange(index, "date", e.target.value)} 
                                  className="w-full border border-gray-300 rounded-md py-1.5 px-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                />
                              </td>
                              <td className="px-2 py-3">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                  </div>
                                  <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={entry.amount} 
                                    onChange={(e) => handleChange(index, "amount", e.target.value)} 
                                    className="w-full border border-gray-300 rounded-md py-1.5 pl-6 pr-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-3">
                                <select 
                                  value={entry.type} 
                                  onChange={(e) => handleChange(index, "type", e.target.value)} 
                                  className="w-full border border-gray-300 rounded-md py-1.5 px-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="credit">Credit</option>
                                  <option value="debit">Debit</option>
                                </select>
                              </td>
                              <td className="px-2 py-3">
                                <button 
                                  className="inline-flex items-center text-red-500 hover:text-red-700 focus:outline-none" 
                                  onClick={() => deleteRow(index)}
                                >
                                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button 
                      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center" 
                      onClick={addRow}
                    >
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Entry
                    </button>
                    <button 
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center" 
                      onClick={handleSubmit}
                      disabled={entries.length === 0}
                    >
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Submit All
                    </button>
                    <button 
                      className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors flex items-center ml-auto" 
                      onClick={() => setShowForm(false)}
                    >
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Table */}
            <div className="border border-blue-100 rounded-lg shadow-sm p-6 bg-white">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Expense Data</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">Month</th>
                      {Object.keys(data).map((category, i) => (
                        <th key={i} className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">{category}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(data[Object.keys(data)[0]]).map((month, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-200 px-4 py-2 font-medium text-gray-900">{month}</td>
                        {Object.keys(data).map((category, j) => (
                          <td key={j} className="border border-gray-200 px-4 py-2 text-gray-700">
                            {data[category][month]?.toFixed(2) || "0.00"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="border border-blue-100 rounded-lg shadow-sm p-6 bg-white">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Monthly Expenses</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={Object.entries(data).map(([category, values]) => ({
                        category,
                        ...values
                      }))}
                      margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                    >
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(data[Object.keys(data)[0]]).map((month, index) => (
                        <Bar key={index} dataKey={month} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="border border-blue-100 rounded-lg shadow-sm p-6 bg-white">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Expense Distribution</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transformedData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
                      >
                        {transformedData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toFixed(2)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Get Insights Button */}
            <div className="flex justify-center">
              <button 
                onClick={() => setShowInsights(!showInsights)} 
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {showInsights ? "Hide Insights" : "Get Insights"}
              </button>
            </div>

            {showInsights && <EnhancedInsights insights={insights} />}
            {/* Categories Exceeding Budget */}
            {exceedingCategories.length > 0 && (
              <div className="border border-red-200 rounded-lg shadow-sm p-6 bg-red-50">
                <h2 className="text-2xl font-bold mb-4 text-red-700">Budget Exceeded Categories</h2>
                <ul className="space-y-2">
                  {exceedingCategories.map((category, index) => (
                    <li key={index} className="flex items-center text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}