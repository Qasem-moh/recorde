import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [checkInTime, setCheckInTime] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch attendance records
  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/attendance')
      if (!response.ok) {
        const err = await response.text()
        console.error('API returned error:', response.status, err)
        throw new Error(`API /api/attendance failed ${response.status}: ${err}`)
      }
      const data = await response.json()
      setAttendanceRecords(data)
    } catch (error) {
      console.error('Error fetching records:', error)
      alert('Problem fetching attendance records: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    try {
      const response = await fetch('/api/attendance/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkInTime: new Date(),
          name: 'User', // Replace with actual user input
        }),
      })
      const data = await response.json()
      setCheckInTime(new Date().toLocaleTimeString())
      console.log('Check-in successful:', data)
      fetchRecords()
    } catch (error) {
      console.error('Error checking in:', error)
    }
  }

  const handleCheckOut = async () => {
    try {
      const response = await fetch('/api/attendance/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkOutTime: new Date(),
        }),
      })
      const data = await response.json()
      setCheckOutTime(new Date().toLocaleTimeString())
      console.log('Check-out successful:', data)
      fetchRecords()
    } catch (error) {
      console.error('Error checking out:', error)
    }
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎯 Attendance Tracker</h1>
        <p>Track your daily check-in and check-out times</p>
      </div>

      <div className="controls">
        <button className="btn btn-checkin" onClick={handleCheckIn}>
          ✓ Check In
        </button>
        <button className="btn btn-checkout" onClick={handleCheckOut}>
          ✗ Check Out
        </button>
        <button className="btn btn-refresh" onClick={fetchRecords}>
          🔄 Refresh
        </button>
      </div>

      <div className="status">
        {checkInTime && <p className="info">Last Check-in: {checkInTime}</p>}
        {checkOutTime && <p className="info">Last Check-out: {checkOutTime}</p>}
      </div>

      <div className="records">
        <h2>Attendance Records</h2>
        {loading ? (
          <p>Loading...</p>
        ) : attendanceRecords.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
                  <td>
                    {record.checkOutTime
                      ? new Date(record.checkOutTime).toLocaleTimeString()
                      : 'Not checked out'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance records yet.</p>
        )}
      </div>
    </div>
  )
}
