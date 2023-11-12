import React, { useState } from 'react'

function Postline() {

  const [notificationSent, setNotificationSent] = useState(false);

  const sendNotification = async () => {
    try {
      await axios.post('http://localhost:3001/send-notification');
      setNotificationSent(true);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div>
        <button onClick={sendNotification} >
          {notificationSent ? 'Notification Sent!' : 'Send Notification'}
        </button>
    </div>
  )
}

export default Postline