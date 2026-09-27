# Backend API: Create Seance Endpoint

## Endpoint Details
**POST** `/api/seances`

## Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Request Body
```json
{
  "title": "string",           // Required: Seance title
  "date": "YYYY-MM-DD",        // Required: Date in ISO format
  "time": "HH:MM",             // Required: Time in 24-hour format
  "specialty": "string",       // Required: Coach specialty (e.g., "Yoga", "CrossFit")
  "maxMembers": "number",      // Required: Maximum number of members (1-50)
  "description": "string",     // Optional: Seance description
  "duration": "number",        // Optional: Duration in minutes (default: 60)
  "status": "string"           // Optional: Status ("active", "cancelled") default: "active"
}
```

## Success Response (201 Created)
```json
{
  "success": true,
  "message": "Seance created successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Morning Yoga Session",
    "date": "2025-07-10",
    "time": "08:00",
    "specialty": "Yoga",
    "maxMembers": 15,
    "description": "Morning Yoga Session",
    "duration": 60,
    "status": "active",
    "coach": {
      "_id": "60d21b4667d0d8992e610c83",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "enrolledMembers": [],
    "createdAt": "2025-07-02T10:30:00.000Z",
    "updatedAt": "2025-07-02T10:30:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Title is required",
    "Date must be in the future",
    "Max members must be between 1 and 50"
  ]
}
```

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
  "message": "Access denied. Only coaches can create seances."
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "A seance already exists at this date and time for this coach"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error occurred while creating seance"
}
```

## Backend Implementation Notes

### Validation Rules
1. **Title**: Required, min 3 characters, max 100 characters
2. **Date**: Required, must be today or future date
3. **Time**: Required, valid time format (HH:MM)
4. **Specialty**: Required, should match coach's specialty
5. **MaxMembers**: Required, integer between 1-50
6. **DateTime Combination**: Date + Time must be in the future
7. **Coach Availability**: Coach cannot have overlapping seances

### Database Schema (MongoDB/Mongoose)
```javascript
const seanceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Store as "HH:MM"
  specialty: { type: String, required: true },
  maxMembers: { type: Number, required: true, min: 1, max: 50 },
  description: { type: String, default: '' },
  duration: { type: Number, default: 60 }, // in minutes
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrolledMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Security Notes
1. Extract coach ID from JWT token, don't trust client-side data
2. Verify the user has 'coach' role
3. Validate that specialty matches coach's profile
4. Check for scheduling conflicts
5. Sanitize all input data

### Example Backend Controller (Node.js/Express)
```javascript
const createSeance = async (req, res) => {
  try {
    const { title, date, time, specialty, maxMembers, description, duration } = req.body;
    const coachId = req.user.id; // From JWT middleware
    
    // Validate coach role
    if (req.user.role !== 'coach') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only coaches can create seances.' 
      });
    }
    
    // Validate future date/time
    const seanceDateTime = new Date(`${date}T${time}`);
    if (seanceDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Seance date and time must be in the future'
      });
    }
    
    // Check for conflicts
    const existingSeance = await Seance.findOne({
      coach: coachId,
      date: new Date(date),
      time: time,
      status: 'active'
    });
    
    if (existingSeance) {
      return res.status(409).json({
        success: false,
        message: 'A seance already exists at this date and time'
      });
    }
    
    // Create seance
    const seance = new Seance({
      title: title.trim(),
      date: new Date(date),
      time,
      specialty,
      maxMembers: parseInt(maxMembers),
      description: description || title.trim(),
      duration: duration || 60,
      coach: coachId
    });
    
    await seance.save();
    await seance.populate('coach', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Seance created successfully',
      data: seance
    });
    
  } catch (error) {
    console.error('Create seance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while creating seance'
    });
  }
};
```
