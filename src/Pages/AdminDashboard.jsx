import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Logo from "../assets/Main.png";
import axios from "axios";


import { API_BASE_URL } from "../services/api";

function EditArchetypeForm({ archetype, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: archetype.name || '',
    description: archetype.description || '',
    binary_representation: archetype.binary_representation || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px] min-h-[100px]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Binary Representation</label>
        <input
          type="text"
          name="binary_representation"
          value={formData.binary_representation}
          onChange={handleChange}
          className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
          required
        />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-[2px] hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#1E1E1E] text-white rounded-[2px] hover:bg-gray-800"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function EditProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product.name || '',
    purchase_url: product.purchase_url || '',
    image_url: product.image_url || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase URL</label>
        <input
          type="url"
          name="purchase_url"
          value={formData.purchase_url}
          onChange={handleChange}
          className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
          required
        />
      </div>
      {formData.image_url && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
          <img 
            src={formData.image_url} 
            alt="Product preview" 
            className="max-h-40 object-contain border border-gray-200 p-2"
            onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'}
          />
        </div>
      )}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-[2px] hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#1E1E1E] text-white rounded-[2px] hover:bg-gray-800"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function EditLookForm({ look, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: look.name || '',
    category: look.category || 'FACE',
    expertise_required: look.expertise_required || 'BEGINNER',
    application_time: look.application_time || 10,
    image_url: look.image_url || '',
    artist: look.artist || '',
    instructions: Array.isArray(look.instructions) ? look.instructions.join('\n') : ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert instructions back to array
    const updatedData = {
      ...formData,
      instructions: formData.instructions.split('\n').filter(line => line.trim() !== '')
    };
    onSave(updatedData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
            required
          >
            <option value="FACE">Face</option>
            <option value="EYES">Eyes</option>
            <option value="LIPS">Lips</option>
            <option value="FULL_FACE">Full Face</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expertise Required</label>
          <select
            name="expertise_required"
            value={formData.expertise_required}
            onChange={handleChange}
            className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
            required
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Application Time (minutes)</label>
          <input
            type="number"
            name="application_time"
            value={formData.application_time}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px]"
          required
        />
      </div>
      {formData.image_url && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
          <img 
            src={formData.image_url} 
            alt="Look preview" 
            className="max-h-40 object-contain border border-gray-200 p-2"
            onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'}
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (one per line)</label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px] min-h-[150px]"
          placeholder="1. Apply foundation
2. Add blush
3. Finish with highlighter"
          required
        />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-[2px] hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#1E1E1E] text-white rounded-[2px] hover:bg-gray-800"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("archetypes");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Data states
  const [archetypesData, setArchetypesData] = useState("");
  const [productsData, setProductsData] = useState("");
  const [looksData, setLooksData] = useState("");
  const [archetypeLookData, setArchetypeLookData] = useState("");
  const [lookProductData, setLookProductData] = useState("");
  
  // Results states
  const [archetypesResult, setArchetypesResult] = useState("");
  const [productsResult, setProductsResult] = useState("");
  const [looksResult, setLooksResult] = useState("");
  const [archetypeLookResult, setArchetypeLookResult] = useState("");
  const [lookProductResult, setLookProductResult] = useState("");
  
  // View data states
  const [archetypesList, setArchetypesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [looksList, setLooksList] = useState([]);

  // Add a new state to track admin status
  const [isAdmin, setIsAdmin] = useState(false);

  // Add these state variables at the top with your other states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemType, setItemType] = useState(''); // 'archetype', 'product', or 'look'

  // Add these new state variables at the top with other states
  const [associationsList, setAssociationsList] = useState({
    archetype_look_associations: [],
    look_product_associations: []
  });

  useEffect(() => {
    // Check for existing token in localStorage
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      
      // Verify if the user is an admin by making a test request to an admin endpoint
      const verifyAdmin = async () => {
        try {
          // Make a request to a simple admin endpoint
          await axios.get(`${API_BASE_URL}/admin/check`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          
          // If the request succeeds, the user is an admin
          setIsAdmin(true);
          setIsAuthenticated(true);
        } catch (error) {
          // If we get a 403 error, the user is not an admin
          if (error.response?.status === 403) {
            setError("You don't have admin privileges");
            localStorage.removeItem('token');
            setToken("");
          }
        }
      };
      
      verifyAdmin();
    }
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: loginData.email,
        password: loginData.password,
      });
      
      if (response.data && response.data.access_token) {
        // Store the token
        localStorage.setItem('token', response.data.access_token);
        setToken(response.data.access_token);
        
        // Check if the user is an admin
        if (loginData.email === 'admin@narspersona.com') {
          setIsAdmin(true);
          setIsAuthenticated(true);
        } else {
          setError("You don't have admin privileges");
          localStorage.removeItem('token');
          setToken("");
        }
      } else {
        setError("Invalid response from server");
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken("");
    setIsAuthenticated(false);
  };

  // API request helper with improved error handling
  const apiRequest = async (endpoint, method = 'GET', data = null) => {
    try {
      const options = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Add timeout to prevent hanging requests
        timeout: 10000
      };
      
      if (data) {
        options.data = data;
      }
      
      console.log(`Making ${method} request to: ${endpoint}`);
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        if (error.response.status === 403 && 
            error.response.data?.error === "Admin access required") {
          alert("You don't have admin privileges. Please contact an administrator.");
        }
        
        throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your network connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Request configuration error: ${error.message}`);
      }
    }
  };

  // Add Archetypes
  const handleAddArchetypes = async () => {
    try {
      setIsLoading(true);
      setArchetypesResult("Processing...");
      
      const data = JSON.parse(archetypesData);
      const result = await apiRequest('/admin/archetypes/bulk', 'POST', data);
      
      setArchetypesResult(JSON.stringify(result, null, 2));
      setIsLoading(false);
    } catch (error) {
      setArchetypesResult(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Add Products
  const handleAddProducts = async () => {
    try {
      setIsLoading(true);
      setProductsResult("Processing...");
      
      const data = JSON.parse(productsData);
      const result = await apiRequest('/admin/products/bulk', 'POST', data);
      
      setProductsResult(JSON.stringify(result, null, 2));
      setIsLoading(false);
    } catch (error) {
      setProductsResult(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Add Looks
  const handleAddLooks = async () => {
    try {
      setIsLoading(true);
      setLooksResult("Processing...");
      
      const data = JSON.parse(looksData);
      const result = await apiRequest('/admin/looks/bulk', 'POST', data);
      
      setLooksResult(JSON.stringify(result, null, 2));
      setIsLoading(false);
    } catch (error) {
      setLooksResult(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Associate Archetypes with Looks
  const handleAssociateArchetypeLooks = async () => {
    try {
      setIsLoading(true);
      setArchetypeLookResult("Processing...");
      
      const data = JSON.parse(archetypeLookData);
      const result = await apiRequest('/admin/archetypes/bulk-associate-looks', 'POST', data);
      
      setArchetypeLookResult(JSON.stringify(result, null, 2));
      setIsLoading(false);
    } catch (error) {
      setArchetypeLookResult(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Associate Looks with Products
  const handleAssociateLookProducts = async () => {
    try {
      setIsLoading(true);
      setLookProductResult("Processing...");
      
      const data = JSON.parse(lookProductData);
      const result = await apiRequest('/admin/looks/bulk-associate-products', 'POST', data);
      
      setLookProductResult(JSON.stringify(result, null, 2));
      setIsLoading(false);
    } catch (error) {
      setLookProductResult(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Load data for viewing
  const handleLoadArchetypes = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest('/archetypes');
      setArchetypesList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading archetypes:", error);
      setIsLoading(false);
    }
  };

  const handleLoadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest('/products');
      setProductsList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      setIsLoading(false);
    }
  };

  const handleLoadLooks = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest('/looks');
      setLooksList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading looks:", error);
      setIsLoading(false);
    }
  };

  // Edit handlers
  const handleEditArchetype = (archetype) => {
    setCurrentItem(archetype);
    setItemType('archetype');
    setEditModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setCurrentItem(product);
    setItemType('product');
    setEditModalOpen(true);
  };

  const handleEditLook = (look) => {
    setCurrentItem(look);
    setItemType('look');
    setEditModalOpen(true);
  };

  // Delete handlers
  const handleDeleteArchetype = (id) => {
    setCurrentItem({ id });
    setItemType('archetype');
    setDeleteModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    setCurrentItem({ id });
    setItemType('product');
    setDeleteModalOpen(true);
  };

  const handleDeleteLook = (id) => {
    setCurrentItem({ id });
    setItemType('look');
    setDeleteModalOpen(true);
  };

  // Confirm delete handler with improved error handling
  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      
      let endpoint = '';
      let itemName = '';
      switch (itemType) {
        case 'archetype':
          endpoint = `/admin/archetypes/${currentItem.id}`;
          itemName = 'archetype';
          break;
        case 'product':
          endpoint = `/admin/products/${currentItem.id}`;
          itemName = 'product';
          break;
        case 'look':
          endpoint = `/admin/looks/${currentItem.id}`;
          itemName = 'look';
          break;
        default:
          throw new Error('Unknown item type');
      }
      
      console.log(`Attempting to delete ${itemName} with ID: ${currentItem.id}`);
      
      try {
        await apiRequest(endpoint, 'DELETE');
        console.log(`Successfully deleted ${itemName} with ID: ${currentItem.id}`);
        
        // Refresh the data
        switch (itemType) {
          case 'archetype':
            await handleLoadArchetypes();
            break;
          case 'product':
            await handleLoadProducts();
            break;
          case 'look':
            await handleLoadLooks();
            break;
        }
        
        setDeleteModalOpen(false);
        setCurrentItem(null);
      } catch (deleteError) {
        console.error(`Error deleting ${itemName}:`, deleteError);
        alert(`Error deleting ${itemName}: ${deleteError.message}`);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error in delete process:', error);
      setIsLoading(false);
      alert(`Error in delete process: ${error.message}`);
    }
  };

  // Save edit handler
  const saveEdit = async (updatedItem) => {
    try {
      setIsLoading(true);
      
      let endpoint = '';
      switch (itemType) {
        case 'archetype':
          endpoint = `/admin/archetypes/${currentItem.id}`;
          break;
        case 'product':
          endpoint = `/admin/products/${currentItem.id}`;
          break;
        case 'look':
          endpoint = `/admin/looks/${currentItem.id}`;
          break;
        default:
          throw new Error('Unknown item type');
      }
      
      await apiRequest(endpoint, 'PUT', updatedItem);
      
      // Refresh the data
      switch (itemType) {
        case 'archetype':
          handleLoadArchetypes();
          break;
        case 'product':
          handleLoadProducts();
          break;
        case 'look':
          handleLoadLooks();
          break;
      }
      
      setEditModalOpen(false);
      setCurrentItem(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating item:', error);
      setIsLoading(false);
      // Show error message
      alert(`Error updating item: ${error.message}`);
    }
  };

  // Add this new function with other handler functions
  const handleLoadAssociations = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest('/admin/associations');
      setAssociationsList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading associations:", error);
      setIsLoading(false);
    }
  };

  // Add these delete handlers with other delete functions
  const handleDeleteArchetypeLookAssociation = async (archetypeId, lookId) => {
    try {
      setIsLoading(true);
      await apiRequest(`/admin/archetypes/${archetypeId}/looks/${lookId}`, 'DELETE');
      await handleLoadAssociations(); // Refresh the associations list
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting archetype-look association:", error);
      alert(`Error deleting association: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleDeleteLookProductAssociation = async (lookId, productId) => {
    try {
      setIsLoading(true);
      await apiRequest(`/admin/looks/${lookId}/products/${productId}`, 'DELETE');
      await handleLoadAssociations(); // Refresh the associations list
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting look-product association:", error);
      alert(`Error deleting association: ${error.message}`);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center flex flex-col items-center justify-center">
          <div className="flex justify-center items-center">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="mt-8 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E1E1E]" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md space-y-6 flex flex-col items-center gap-8">
          <div className="text-center flex items-center justify-center w-[66%]">
            <img src={Logo} alt="Logo" />
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-2xl font-semibold">Admin Login</h2>
            <div className="space-y-3 mb-3 md:w-[423px]">
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className={`w-full px-3 py-2 border-b outline rounded-[2px] font-light text-[16px] leading-[20px] tracking-[0px] font-helvetica ${error ? "border-red-500" : "border-gray-300"}`}
                placeholder="Email"
                style={{ 
                  fontSize: '14px', 
                  color: loginData.email ? '#1E1E1E' : '#888888',
                  fontWeight: loginData.email ? '500' : '400'
                }}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className={`w-full px-3 py-2 border-b outline font-light text-[16px] leading-[20px] tracking-[0px] font-helvetica rounded-[2px] ${error ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Password"
                  style={{ 
                    fontSize: '14px', 
                    color: loginData.password ? '#1E1E1E' : '#888888',
                    fontWeight: loginData.password ? '500' : '400'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1E1E1E]"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1E1E1E] text-white py-3 rounded-[2px] hover:bg-gray-800 transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              disabled={isLoading}
            >
              Login
            </button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1E1E1E] text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">NARS Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-white hover:underline"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'archetypes' ? 'border-[#1E1E1E] text-[#1E1E1E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('archetypes')}
            >
              Archetypes
            </button>
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'products' ? 'border-[#1E1E1E] text-[#1E1E1E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'looks' ? 'border-[#1E1E1E] text-[#1E1E1E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('looks')}
            >
              Looks
            </button>
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'associations' ? 'border-[#1E1E1E] text-[#1E1E1E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('associations')}
            >
              Associations
            </button>
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'view' ? 'border-[#1E1E1E] text-[#1E1E1E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('view')}
            >
              View Data
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Archetypes Tab */}
          {activeTab === 'archetypes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Add Archetypes</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Archetypes JSON Data
                  </label>
                  <textarea
                    value={archetypesData}
                    onChange={(e) => setArchetypesData(e.target.value)}
                    className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px] font-helvetica min-h-[200px]"
                    placeholder={`[
  {
    "name": "Classic",
    "binary_representation": "10000",
    "description": "Timeless and elegant style with clean lines and neutral colors."
  }
]`}
                  />
                </div>
                <button
                  onClick={handleAddArchetypes}
                  className="bg-[#1E1E1E] text-white py-2 px-4 rounded-[2px] hover:bg-gray-800 transition-colors font-semibold"
                >
                  Add Archetypes
                </button>
                {archetypesResult && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Result:</h3>
                    <pre className="bg-gray-100 p-4 rounded-[2px] overflow-x-auto text-sm">
                      {archetypesResult}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Add Products</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Products JSON Data
                  </label>
                  <textarea
                    value={productsData}
                    onChange={(e) => setProductsData(e.target.value)}
                    className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px] font-helvetica min-h-[200px]"
                    placeholder={`[
  {
    "name": "Radiant Creamy Concealer",
    "purchase_url": "https://www.narscosmetics.com/radiant-creamy-concealer",
    "image_url": "https://www.narscosmetics.com/dw/image/v2/radiant-creamy-concealer.jpg"
  }
]`}
                  />
                </div>
                <button
                  onClick={handleAddProducts}
                  className="bg-[#1E1E1E] text-white py-2 px-4 rounded-[2px] hover:bg-gray-800 transition-colors font-semibold"
                >
                  Add Products
                </button>
                {productsResult && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Result:</h3>
                    <pre className="bg-gray-100 p-4 rounded-[2px] overflow-x-auto text-sm">
                      {productsResult}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Looks Tab */}
          {activeTab === 'looks' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Add Looks</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Looks JSON Data
                  </label>
                  <textarea
                    value={looksData}
                    onChange={(e) => setLooksData(e.target.value)}
                    className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px] font-helvetica min-h-[200px]"
                    placeholder={`[
  {
    "name": "Natural Glow",
    "category": "FACE",
    "expertise_required": "BEGINNER",
    "application_time": 10,
    "image_url": "https://example.com/natural-glow.jpg",
    "artist": "Jane Doe",
    "instructions": ["Apply foundation", "Add blush", "Finish with highlighter"]
  }
]`}
                  />
                </div>
                <button
                  onClick={handleAddLooks}
                  className="bg-[#1E1E1E] text-white py-2 px-4 rounded-[2px] hover:bg-gray-800 transition-colors font-semibold"
                >
                  Add Looks
                </button>
                {looksResult && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Result:</h3>
                    <pre className="bg-gray-100 p-4 rounded-[2px] overflow-x-auto text-sm">
                      {looksResult}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Associations Tab */}
          {activeTab === 'associations' && (
            <div className="space-y-8">
              {/* Archetype-Look Associations */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Associate Archetypes with Looks</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archetype-Look Associations
                    </label>
                    <textarea
                      value={archetypeLookData}
                      onChange={(e) => setArchetypeLookData(e.target.value)}
                      className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px] font-helvetica min-h-[150px]"
                      placeholder={`[
  {
    "archetype_id": 1,
    "look_ids": [1, 2, 3],
    "clear_existing": true
  }
]`}
                    />
                  </div>
                  <button
                    onClick={handleAssociateArchetypeLooks}
                    className="bg-[#1E1E1E] text-white py-2 px-4 rounded-[2px] hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Create Associations
                  </button>
                  {archetypeLookResult && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Result:</h3>
                      <pre className="bg-gray-100 p-4 rounded-[2px] overflow-x-auto text-sm">
                        {archetypeLookResult}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Look-Product Associations */}
              <div className="space-y-6 mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-semibold">Associate Looks with Products</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Look-Product Associations
                    </label>
                    <textarea
                      value={lookProductData}
                      onChange={(e) => setLookProductData(e.target.value)}
                      className="w-full px-3 py-2 border outline rounded-[2px] font-light text-[14px] font-helvetica min-h-[150px]"
                      placeholder={`[
  {
    "look_id": 1,
    "product_ids": [1, 2, 3],
    "clear_existing": true
  }
]`}
                    />
                  </div>
                  <button
                    onClick={handleAssociateLookProducts}
                    className="bg-[#1E1E1E] text-white py-2 px-4 rounded-[2px] hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Associate Products
                  </button>
                  {lookProductResult && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Result:</h3>
                      <pre className="bg-gray-100 p-4 rounded-[2px] overflow-x-auto text-sm">
                        {lookProductResult}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* View Data Tab */}
          {activeTab === 'view' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">View Database Data</h2>
              
              {/* Archetypes */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Archetypes</h3>
                  <button
                    onClick={handleLoadArchetypes}
                    className="bg-[#1E1E1E] text-white py-1 px-3 rounded-[2px] hover:bg-gray-800 transition-colors text-sm"
                  >
                    Load Archetypes
                  </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-[2px] min-h-[200px] overflow-x-auto">
                  {archetypesList.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Binary Rep</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {archetypesList.map((archetype) => (
                          <tr key={archetype.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{archetype.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{archetype.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{archetype.description}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{archetype.binary_representation}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleEditArchetype(archetype)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteArchetype(archetype.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500 py-10">Click "Load Archetypes" to view data</p>
                  )}
                </div>
              </div>
              
              {/* Products */}
              <div className="space-y-4 mt-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Products</h3>
                  <button
                    onClick={handleLoadProducts}
                    className="bg-[#1E1E1E] text-white py-1 px-3 rounded-[2px] hover:bg-gray-800 transition-colors text-sm"
                  >
                    Load Products
                  </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-[2px] min-h-[200px] overflow-x-auto">
                  {productsList.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase URL</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image URL</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {productsList.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              <a href={product.purchase_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {product.purchase_url}
                              </a>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              <a href={product.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {product.image_url}
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500 py-10">Click "Load Products" to view data</p>
                  )}
                </div>
              </div>
              
              {/* Looks */}
              <div className="space-y-4 mt-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Looks</h3>
                  <button
                    onClick={handleLoadLooks}
                    className="bg-[#1E1E1E] text-white py-1 px-3 rounded-[2px] hover:bg-gray-800 transition-colors text-sm"
                  >
                    Load Looks
                  </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-[2px] min-h-[200px] overflow-x-auto">
                  {looksList.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (min)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {looksList.map((look) => (
                          <tr key={look.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{look.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{look.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{look.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{look.expertise_required}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{look.application_time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{look.artist}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {look.image_url && (
                                <a href={look.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  View Image
                                </a>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleEditLook(look)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteLook(look.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500 py-10">Click "Load Looks" to view data</p>
                  )}
                </div>
              </div>
              
              {/* Archetype-Look Associations */}
              <div className="space-y-4 mt-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Archetype-Look Associations</h3>
                  <button
                    onClick={handleLoadAssociations}
                    className="bg-[#1E1E1E] text-white py-1 px-3 rounded-[2px] hover:bg-gray-800 transition-colors text-sm"
                  >
                    Load Associations
                  </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-[2px] min-h-[200px] overflow-x-auto">
                  {associationsList.archetype_look_associations && associationsList.archetype_look_associations.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archetype ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archetype Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Look ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Look Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {associationsList.archetype_look_associations.map((assoc, index) => (
                          <tr key={`al-${assoc.archetype_id}-${assoc.look_id}-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assoc.archetype_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assoc.archetype_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assoc.look_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assoc.look_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleDeleteArchetypeLookAssociation(assoc.archetype_id, assoc.look_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500 py-10">Click "Load Associations" to view data</p>
                  )}
                </div>
              </div>
              
              {/* Look-Product Associations */}
              <div className="space-y-4 mt-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Look-Product Associations</h3>
                  <button
                    onClick={handleLoadAssociations}
                    className="bg-[#1E1E1E] text-white py-1 px-3 rounded-[2px] hover:bg-gray-800 transition-colors text-sm"
                  >
                    Load Associations
                  </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-[2px] min-h-[200px] overflow-x-auto">
                  {associationsList.look_product_associations && associationsList.look_product_associations.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Look ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Look Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {associationsList.look_product_associations.map((assoc, index) => (
                          <tr key={`lp-${assoc.look_id}-${assoc.product_id}-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assoc.look_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assoc.look_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assoc.product_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assoc.product_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleDeleteLookProductAssociation(assoc.look_id, assoc.product_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500 py-10">Click "Load Associations" to view data</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-[2px] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-[2px] hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">
              Edit {itemType === 'archetype' ? 'Archetype' : itemType === 'product' ? 'Product' : 'Look'}
            </h3>
            
            {/* Archetype Edit Form */}
            {itemType === 'archetype' && (
              <EditArchetypeForm 
                archetype={currentItem} 
                onSave={saveEdit} 
                onCancel={() => setEditModalOpen(false)} 
              />
            )}
            
            {/* Product Edit Form */}
            {itemType === 'product' && (
              <EditProductForm 
                product={currentItem} 
                onSave={saveEdit} 
                onCancel={() => setEditModalOpen(false)} 
              />
            )}
            
            {/* Look Edit Form */}
            {itemType === 'look' && (
              <EditLookForm 
                look={currentItem} 
                onSave={saveEdit} 
                onCancel={() => setEditModalOpen(false)} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;