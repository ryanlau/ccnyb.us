import time
from datetime import datetime
import requests
from pytz import timezone
import os
from supabase import create_client
# import a utility function for loading Roboflow models
from inference import get_model
# import supervision to visualize our results
import supervision as sv
# import cv2 to helo load our image
import cv2
from dotenv import load_dotenv
from roboflow import Roboflow

load_dotenv(dotenv_path='.env.local')

os.makedirs("predictions", exist_ok=True)
os.makedirs("raw", exist_ok=True)

camera_feed_125 = "https://webcams.nyctmc.org/api/cameras/98b37dd5-bd64-4ace-add0-37f5135df600/image"
camera_feed_145 = "https://webcams.nyctmc.org/api/cameras/09b1235e-d2d1-4451-83a5-5a1c3ec280aa/image"

rf = Roboflow(api_key=os.getenv('ROBOFLOW_API_KEY'))

project = rf.workspace(os.getenv('ROBOFLOW_WORKSPACE')).project(os.getenv('ROBOFLOW_PROJECT_ID'))

model = get_model(
    f"{os.getenv('ROBOFLOW_PROJECT_ID')}/{os.getenv('ROBOFLOW_MODEL_VERSION')}", 
    api_key=os.getenv('ROBOFLOW_API_KEY')
)

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_ANON_KEY'))

STOP = "125"

def get_formatted_current_time():
    est = timezone('US/Eastern')
    current_time = datetime.now(est)
    return current_time.strftime('%Y/%m/%d/%H/%M_%S')

def download_image(t):
    response = requests.get(camera_feed_125) # hard coded

    if response.status_code != 200:
        print("failed to get image")
        return

    os.makedirs(f"raw/{STOP}/" + t.rsplit("/", 1)[0], exist_ok=True)
    
    with open(f"raw/{STOP}/{t}.jpg", "wb") as file:
        file.write(response.content)

    print("downloaded image")
    
def run_and_save_detection(t):
    image = cv2.imread(f"raw/{STOP}/{t}.jpg")
    results = model.infer(image, confidence=0.7, overlap=0.5)
    if len(results[0].predictions) > 0:
        os.makedirs(f"predictions/{STOP}/{t.rsplit('/', 1)[0]}", exist_ok=True)

        # mark up the photo with bounding boxes if there is bus

        # load the results into the supervision Detections api
        detections = sv.Detections.from_inference(results[0].dict(by_alias=True, exclude_none=True))


        labels = [
            ("{:.2f}".format(conf * 100)) + "%"
            for conf
            in detections.confidence
        ]


        # create supervision annotators
        bounding_box_annotator = sv.BoundingBoxAnnotator()
        label_annotator = sv.LabelAnnotator()

        # annotate the image with our inference results
        annotated_image = bounding_box_annotator.annotate(scene=image, detections=detections)
        annotated_image = label_annotator.annotate(scene=annotated_image, detections=detections, labels=labels)

        cv2.imwrite(f"predictions/{STOP}/{t}.jpg", annotated_image)

        with open(f"predictions/{STOP}/{t}.jpg", 'rb') as f:
            date = t.split("/")[:3]
            date = "_".join(date) + f"/{STOP}/"
            supabase_path = t.rsplit("/", 2)[1:]
            supabase_path = date + "_".join(supabase_path) + '.jpg'
            supabase.storage.from_("predictions").upload(file=f"predictions/{STOP}/{t}.jpg",path=supabase_path, file_options={"content-type": "image/jpg"})
        print('bus detected..., saved prediction locally and to supabase')
    else:
        print("no bus")

def main():
    t = get_formatted_current_time()
    download_image(t)
    run_and_save_detection(t)

while True:
    try:
        main()
    except Exception as e:
        print(e)
        print("gg")
        pass

    time.sleep(5)