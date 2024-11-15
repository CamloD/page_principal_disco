// Helper function to get users from localStorage
const getUsers = () => {
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []
  }
  
  // Helper function to save users to localStorage
  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users))
  }
  
  export function saveUser(user) {
    const users = getUsers()
    users.push(user)
    saveUsers(users)
  }
  
  export function findUser(email, password) {
    const users = getUsers()
    return users.find(user => user.email === email && user.password === password)
  }
  
  // New function to check if a user already exists
  export function userExists(email) {
    const users = getUsers()
    return users.some(user => user.email === email)
  }