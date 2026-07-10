# Database Design

user [icon: user, color: blue] {
    id uuid pk  
    email string unique  
    password string writeOnly   
    role string // choices "admin" , "employee"  
    first_name string  
    last_name string  
    is_active bool  
    updated_at timestamp  
    created_at timstamp  
}  
  
policy [icon: document , color : white] {  
  id uuid pk   
  name string   
  department string   
  file file  
  status string  // choices  "processing" , "ready",   "failed"  
  effective_from timestamp  
  version float  
  description  string optional
  uploaded_on timestamp
  updated_on timestamp
  uploaded_by fk
}


conversation [icon: chat , color: red ]{
  id uuid pk 
  title string 
  created_at timestamp 
  updated_at timestamp 
  created_by fk
}

message [icon:message-circle-question , color :orange] {
  id uuid pk 
  question string
  answer string 
  sources json[]
  response_time int
  created_at timestamp
}

feedback [icon: thumbs-up , color: green]{
  id uuid pk 
  rating string // choices : "positive" , "negative"
  comment string 
  created_at timestamp
  message 
}

policy.uploaded_by > user.id
conversation.created_by > user.id
message.conversation > conversation.id
feedback.message - message.id