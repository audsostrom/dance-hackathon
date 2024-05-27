# Filename - server.py
 
# Import flask and datetime module for showing date and time
import json
from flask import stream_with_context, Flask, Response, request, jsonify
from flask_cors import CORS
# from dotenv import load_dotenv
import mediapipe as mp
import datetime
import cv2
import joblib
import numpy as np
import pandas as pd 
import requests
import os


# Initializing flask app
app = Flask(__name__)
CORS(app)
# load_dotenv()


mp_drawing = mp.solutions.drawing_utils  # Drawing helpers
mp_pose = mp.solutions.pose
 
 
# Route for seeing a data
@app.route('/get-fake-answers', methods=['POST'])
def chat():
    data = request.json
    print(data)
    if 'message' not in data:
        return jsonify({"error": "Message is required"}), 400
    
    # Parse the message as J
    # Format the parsed JSON as a string with correct escaping for the f-string
    questions_str = json.dumps(data['message'], indent=4)

    user_message = f"""
    You are a helpful assistant trying to help a teacher create multiple choice questions to test students. Given a series of questions and the correct answers, can you create three fake (but convincing) answers to make the question challenging?

    The questions with the correct answers will given as an input in this format:
    [
    {{
    'question': '',
    'correctAnswer': '',
    }}
    ]

    And your response will be a JSON output in this format:
    [
    {{
    'fake-answers': ['', '', '']
    }}
    ]

    Here is an example input, and an example output to base your response on. Given this input of questions:
    [
    {{
    'question': 'Who was the first U.S. President?',
    'correctAnswer': 'George Washington',
    }},
    {{
    'question': 'What was the first national park in the United States?',
    'correctAnswer': 'Yellowstone National Park',
    }},
    {{
    'question': 'What is the largest organelle in a eukaryotic cell?',
    'correctAnswer': 'The nucleus',
    }},
    ]

    The appropriate JSON-formatted response to the above input would be:
    [
    {{
    'fake-answers': ['Alexander Hamilton', 'John Adams', 'Benjamin Franklin']
    }},
    {{
    'fake-answers': ['Fort Davis', 'Amache National Historic Site', 'Acadia National Park']
    }},
    {{
    'fake-answers': ['The mitochondria', 'The ribosomes', 'The lysosomes']
    }},
    ]

    The index of element in the response corresponds to the index of the original question in the input.

    Now can you follow the above instructions and write three false answers for this set of questions, and return an output in a JSON format like in the example and format I showed you:
    {questions_str}
    """
    
    headers = {
        'Authorization': f"Bearer {os.environ['GPT_API_KEY']}",
        'Content-Type': 'application/json'
    }
    
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant trying to help a teacher create multiple choice questions to test students."},
            {"role": "user", "content": user_message}
        ]
    }
    
    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload)
    print(response)
    if response.status_code != 200:
        return jsonify({"error": "Failed to get response from ChatGPT"}), response.status_code
    
    response_data = response.json()
    print(response_data)
    chatgpt_message = response_data['choices'][0]['message']['content']
    
    return jsonify({"response": chatgpt_message})


@app.route('/video_feed', methods=['GET'])
def video_feed():
    # return webcam()
    return Response(webcam(), mimetype='multipart/x-mixed-replace; boundary=frame')

with open('final_pose_model.pkl', 'rb') as f:
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
        
                # file = {'file': (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')}
                # file = {'file': ('image.jpg', buffer.tostring(), 'image/jpeg', {'Expires': '0'})}
                data = {"id" : str(round(body_language_prob[np.argmax(body_language_prob)], 2))}
                # def stream_context():
                    # yield file
                    # yield data
                    # yield (b'--frame\r\n'
                    #     b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                # stream_with_context(stream_context())
                yield (b'--frame\r\n'
                        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                # yield bytes(file, data)
                # stream_context()
               
            
            else:
                camera.release()
        # return stream_with_context(stream_context())

def data():
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
        
                # file = {'file': (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')}
                # file = {'file': ('image.jpg', buffer.tostring(), 'image/jpeg', {'Expires': '0'}}
                acc = round(body_language_prob[np.argmax(body_language_prob)], 2)
                data = body_language_class.split(' ')[0] if acc > 0.5 else "idle"
              
                # def stream_context():
                    # yield file

                # ADDING THIS TO TRY QUIZZES STUFF
                print(data, acc)

                yield data
                    # yield (b'--frame\r\n'
                    #     b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                # stream_with_context(stream_context())
                # yield (b'--frame\r\n'
                #         b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                # yield bytes(file, data)
                # stream_context()
               
            
            else:
                camera.release()


@app.route('/pose_feed', methods=['GET'])
def pose_feed():
    # return webcam()
    return Response(data(), mimetype='application/json')
     

# Running app
if __name__ == '__main__':
    app.run(debug=True)
