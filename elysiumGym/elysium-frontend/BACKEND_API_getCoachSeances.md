# Backend API: Get Coach Seances Endpoint

## Endpoint Details
**GET** `/api/coach/seances`

## Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Query Parameters (Optional)
```
?status=active|cancelled    // Filter by status
&specialty=<specialty>      // Filter by specialty  
&date_from=YYYY-MM-DD      // Filter seances from this date
&date_to=YYYY-MM-DD        // Filter seances to this date
&limit=10                  // Limit number of results
&page=1                    // Page number for pagination
```

## Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Morning Yoga Session",
      "date": "2025-07-10",
      "time": "08:00",
      "specialty": "Yoga",
      "maxMembers": 15,
      "description": "Relaxing morning yoga session for all levels",
      "duration": 60,
      "status": "active",
      "coach": {
        "_id": "60d21b4667d0d8992e610c83",
        "name": "John Doe",
        "email": "john@example.com",
        "specialty": "Yoga"
      },
      "enrolledMembers": [
        {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Jane Smith",
          "email": "jane@example.com"
        }
      ],
      "createdAt": "2025-07-02T10:30:00.000Z",
      "updatedAt": "2025-07-02T10:30:00.000Z"
    }
  ],
  "totalCount": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Only coaches can access this endpoint."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error occurred while fetching seances"
}
```

## Backend Implementation Notes

### Database Query
The endpoint should only return seances where the `coach` field matches the authenticated user's ID.

```javascript
const getCoachSeances = async (req, res) => {
  try {
    const coachId = req.user.id; // From JWT middleware
    const { status, specialty, date_from, date_to, limit = 10, page = 1 } = req.query;
    
    // Verify coach role
    if (req.user.role !== 'coach') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only coaches can access this endpoint.' 
      });
    }
    
    // Build query
    const query = { coach: coachId };
    
    if (status) {
      query.status = status;
    }
    
    if (specialty) {
      query.specialty = specialty;
    }
    
    if (date_from || date_to) {
      query.date = {};
      if (date_from) query.date.$gte = new Date(date_from);
      if (date_to) query.date.$lte = new Date(date_to);
    }
    
    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [seances, totalCount] = await Promise.all([
      Seance.find(query)
        .populate('coach', 'name email specialty')
        .populate('enrolledMembers', 'name email')
        .sort({ date: 1, time: 1 }) // Sort by date and time
        .skip(skip)
        .limit(parseInt(limit)),
      Seance.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    
    res.json({
      success: true,
      data: seances,
      totalCount,
      currentPage: parseInt(page),
      totalPages
    });
    
  } catch (error) {
    console.error('Get coach seances error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching seances'
    });
  }
};
```

### Security Notes
1. Extract coach ID from JWT token, don't trust client-side data
2. Verify the user has 'coach' role
3. Only return seances belonging to the authenticated coach
4. Validate query parameters to prevent injection attacks
5. Implement rate limiting for this endpoint

### Database Indexes
For optimal performance, create these MongoDB indexes:
```javascript
// Compound index for coach and date queries
db.seances.createIndex({ "coach": 1, "date": 1, "time": 1 });

// Index for status filtering
db.seances.createIndex({ "coach": 1, "status": 1 });

// Index for specialty filtering
db.seances.createIndex({ "coach": 1, "specialty": 1 });
```

### Response Data Structure
- **_id**: MongoDB ObjectId as string
- **title**: Seance title
- **date**: Date in YYYY-MM-DD format
- **time**: Time in HH:MM format (24-hour)
- **specialty**: Coach's specialty for this seance
- **maxMembers**: Maximum number of members allowed
- **description**: Optional detailed description
- **duration**: Duration in minutes (default: 60)
- **status**: Either "active" or "cancelled"
- **coach**: Populated coach data (id, name, email, specialty)
- **enrolledMembers**: Array of enrolled members (id, name, email)
- **createdAt/updatedAt**: Timestamps

### Frontend Usage
The frontend will call this endpoint to:
1. Display coach's seances in a beautiful card-based layout
2. Filter seances by status and specialty
3. Show enrollment statistics
4. Enable seance management actions (view, edit, cancel)
5. Provide real-time updates after creating new seances
