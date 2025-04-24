import { useState, useEffect } from 'react'

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userCount, setUserCount] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (count) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://randomuser.me/api/?results=${count}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data.results);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(userCount);
  }, [userCount]);

  const handleFetchNewUsers = () => {
    fetchUsers(userCount);
    setSelectedUser(null);
  };

  const handleUserCountChange = (e) => {
    const count = parseInt(e.target.value);
    if (count > 0 && count <= 50) {
      setUserCount(count);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const closeUserDetail = () => {
    setSelectedUser(null);
  };

  const getNationalityEmoji = (nat) => {
    const nationalities = {
      AU: '🇦🇺', BR: '🇧🇷', CA: '🇨🇦', CH: '🇨🇭', DE: '🇩🇪',
      DK: '🇩🇰', ES: '🇪🇸', FI: '🇫🇮', FR: '🇫🇷', GB: '🇬🇧',
      IE: '🇮🇪', IN: '🇮🇳', IR: '🇮🇷', MX: '🇲🇽', NL: '🇳🇱',
      NO: '🇳🇴', NZ: '🇳🇿', RS: '🇷🇸', TR: '🇹🇷', UA: '🇺🇦',
      US: '🇺🇸'
    };
    return nationalities[nat] || '🌍';
  };

  const getGenderIcon = (gender) => {
    return gender === 'male' ? '👨' : '👩';
  };

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight animate-float flex items-center gap-2">
            <span>😊</span>
            Random User Explorer
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/20 p-2 rounded-lg shadow-inner">
              <label htmlFor="userCount" className="mr-2 text-sm font-medium text-indigo-100">Users:</label>
              <input 
                type="number" 
                id="userCount"
                min="1"
                max="50"
                value={userCount}
                onChange={handleUserCountChange}
                className="px-2 py-1 border-0 bg-white/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 w-16 text-center appearance-none"
                aria-label="Number of users to fetch"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
            
            <button 
              onClick={handleFetchNewUsers}
              disabled={loading}
              className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:ring-offset-purple-600 disabled:opacity-70 transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
              tabIndex="0"
              aria-label="Fetch new users"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchNewUsers()}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-indigo-700">Fetching...</span>
                </>
              ) : (
                <>
                  <span>✨ Discover</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 pt-8 w-full flex-grow">
        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300 shadow-md">
            <p className="font-medium flex items-center gap-2">
              <span>⚠️</span> Error: {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-700 font-medium text-lg">Finding amazing people...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {users.map((user, index) => (
              <div 
                key={user.login.uuid} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer animate-fadeIn group border border-gray-200/50"
                style={{ animationDelay: `${index * 0.08}s` }}
                onClick={() => handleUserSelect(user)}
                tabIndex="0"
                onKeyDown={(e) => e.key === 'Enter' && handleUserSelect(user)}
                aria-label={`View details for ${user.name.first} ${user.name.last}`}
              >
                <table className="w-full border-collapse text-sm">
                  <caption className="p-4 text-left bg-gradient-to-r from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors duration-300 border-b border-indigo-200">
                    <div className="flex items-center gap-4">
                      <img 
                        src={user.picture.large} 
                        alt={`${user.name.first} ${user.name.last}`}
                        className="w-16 h-16 rounded-full shadow-md border-2 border-white"
                      />
      <div>
                        <h2 className="text-xl font-semibold text-indigo-800">
                          {user.name.first} {user.name.last}
                          <span className="ml-2 text-lg">{getGenderIcon(user.gender)}</span>
                          <span className="ml-1 text-lg">{getNationalityEmoji(user.nat)}</span>
                        </h2>
                        <p className="text-indigo-600 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </caption>
                  <tbody className="text-gray-700">
                    <tr className="group-hover:bg-gray-50/50 transition-colors duration-150">
                      <th className="p-3 text-left font-semibold w-1/5 bg-gray-50/70 border-r border-gray-200">📍 Location</th>
                      <td className="p-3">{user.location.city}, {user.location.country}</td>
                    </tr>
                    <tr className="group-hover:bg-gray-50/50 transition-colors duration-150">
                      <th className="p-3 text-left font-semibold w-1/5 bg-gray-50/70 border-r border-gray-200">🎂 Age</th>
                      <td className="p-3">{user.dob.age} years</td>
                    </tr>
                    <tr className="group-hover:bg-gray-50/50 transition-colors duration-150">
                      <th className="p-3 text-left font-semibold w-1/5 bg-gray-50/70 border-r border-gray-200">📱 Phone</th>
                      <td className="p-3">{user.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
      </div>
        )}
      </main>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={selectedUser.picture.large}
                alt={`${selectedUser.name.first} ${selectedUser.name.last}`}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                onClick={closeUserDetail}
                aria-label="Close details"
              >
                ✕
        </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden -mt-16">
                  <img 
                    src={selectedUser.picture.large}
                    alt={`${selectedUser.name.first} ${selectedUser.name.last}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    {selectedUser.name.first} {selectedUser.name.last} 
                    <span>{getGenderIcon(selectedUser.gender)}</span>
                    <span>{getNationalityEmoji(selectedUser.nat)}</span>
                  </h2>
                  <p className="text-indigo-600">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Contact Details</h3>
                  <div className="space-y-1">
                    <p className="text-gray-800 flex items-center gap-2">
                      <span className="text-indigo-500">📱</span> 
                      {selectedUser.phone}
                    </p>
                    <p className="text-gray-800 flex items-center gap-2">
                      <span className="text-indigo-500">🏠</span> 
                      {selectedUser.cell}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Personal Details</h3>
                  <div className="space-y-1">
                    <p className="text-gray-800 flex items-center gap-2">
                      <span className="text-indigo-500">🎂</span> 
                      {new Date(selectedUser.dob.date).toLocaleDateString()} ({selectedUser.dob.age} years)
                    </p>
                    <p className="text-gray-800 flex items-center gap-2">
                      <span className="text-indigo-500">👤</span> 
                      {selectedUser.gender.charAt(0).toUpperCase() + selectedUser.gender.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Address</h3>
                <p className="text-gray-800">
                  {selectedUser.location.street.number} {selectedUser.location.street.name},<br />
                  {selectedUser.location.city}, {selectedUser.location.state}, {selectedUser.location.postcode}<br />
                  {selectedUser.location.country}
        </p>
      </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-medium text-indigo-700 mb-2">Account Details</h3>
                <div className="space-y-1">
                  <p className="text-gray-800 flex items-center gap-2">
                    <span className="text-indigo-500">👤</span> 
                    {selectedUser.login.username}
                  </p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <span className="text-indigo-500">🔑</span> 
                    {selectedUser.login.password}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-gray-300 text-center p-4 mt-auto">
        <p>Khaled Abdulnasser Alghamdi - 2135629</p>
        <p>Made with love ❤️</p>
      </footer>
    </div>
  )
}

export default App
