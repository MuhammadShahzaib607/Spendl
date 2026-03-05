import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import YearDetails from './pages/YearDetails.jsx'
import MonthTransactions from './pages/MonthTransactions.jsx'

function App() {
  return (
    <>
    <Routes>
<Route index element={<Home />} />
<Route path='/year/:id' element={<YearDetails />} />
<Route path='/month/:yearId/:monthId' element={<MonthTransactions />} />
    </Routes>
    </>
  )
}

export default App
