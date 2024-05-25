# Filename - server.py
 
# Import flask and datetime module for showing date and time
from flask import Flask, Response
from flask_cors import CORS
import mediapipe as mp
import datetime
import cv2
import joblib
import numpy as np
import pandas as pd 

x = datetime.datetime.now()

 
# Initializing flask app
app = Flask(__name__)
CORS(app)

mp_drawing = mp.solutions.drawing_utils  # Drawing helpers
mp_pose = mp.solutions.pose
 
 
# Route for seeing a data
@app.route('/data')
def get_time():
    print('hi')
 
    # Returning an api for showing in  reactjs
    return {
        'Name':"geek", 
        "Age":"22",
        "Date":x, 
        "programming":"python"
      }

@app.route('/video_feed', methods=['GET'])
def video_feed():
    return Response(webcam(), mimetype='multipart/x-mixed-replace; boundary=frame')

with open('best-dab-pose-model.pkl', 'rb') as f:
    model = joblib.load(f)


def webcam():
    camera = cv2.VideoCapture(0)

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:

        while True:
            success, frame = camera.read()
            if success:
                # Recolor Feed
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False

                # Make Detections
                results = pose.process(image)

                # Recolor image back to BGR for rendering
                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                # Draw landmarks
                # if not show_landmarks:
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                        mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=4),
                                        mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
                                        )
                    
                # Extract landmarks
                landmarks = results.pose_landmarks.landmark
                arm_landmarks = []
                pose_index = mp_pose.PoseLandmark.LEFT_SHOULDER.value
                arm_landmarks += [landmarks[pose_index].x, landmarks[pose_index].y, landmarks[pose_index].z]

                pose_index = mp_pose.PoseLandmark.RIGHT_SHOULDER.value
                arm_landmarks += [landmarks[pose_index].x, landmarks[pose_index].y, landmarks[pose_index].z]

                pose_index = mp_pose.PoseLandmark.LEFT_ELBOW.value
                arm_landmarks += [landmarks[pose_index].x, landmarks[pose_index].y, landmarks[pose_index].z]

                pose_index = mp_pose.PoseLandmark.RIGHT_ELBOW.value
                arm_landmarks += [landmarks[pose_index].x, landmarks[pose_index].y, landmarks[pose_index].z]

                pose_index = mp_pose.PoseLandmark.LEFT_WRIST.value
                arm_landmarks += [landmarks[pose_index].x, landmarks[pose_index].y, landmarks[pose_index].z]

                pose_index = mp_pose.PoseLandmark.RIGHT_WRIST.value
                arm_landmarks += [landmarks[pose_index].x, landmarks[pose_index].y, landmarks[pose_index].z]

                row = np.around(arm_landmarks, decimals=9).tolist()

                # Make Detections
                X = pd.DataFrame([row])
                body_language_class = model.predict(X)[0]
                body_language_prob = model.predict_proba(X)[0]
                # print(body_language_class, np.around(body_language_prob, decimals=3))

                # Get status box
                status_width = 250
                cv2.rectangle(image, (0, 0), (status_width, 60), (245, 117, 16), -1)

                # Display Class
                cv2.putText(image, 'CLASS'
                            , (95, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                cv2.putText(image, body_language_class.split(' ')[0]
                            , (90, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                # Display Probability
                cv2.putText(image, 'PROB'
                            , (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                cv2.putText(image, str(round(body_language_prob[np.argmax(body_language_prob)], 2))
                            , (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)


                ret, buffer = cv2.imencode('.jpg', image)
                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                
        
            else:
                camera.release()


     

# Running app
if __name__ == '__main__':
    app.run(debug=True)
