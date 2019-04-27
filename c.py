from clarifai.rest import ClarifaiApp
import sys
# Instantiate a new Clarifai app by passing in your API key.
app = ClarifaiApp(api_key = "cc851bd3922c4d19b7df124c4aea64ba")

# Choose one of the public models.
model = app.public_models.general_model
image_url = sys.argv[1]
response = model.predict_by_url(url=image_urls)

response = response["outputs"][0]["data"]["concepts"]

print (type(response))
res = " "
flood = 0
fire = 0
earthQuake = 0
for d in response:
	cur = d["name"].lower().trim()
	if cur == "flood":
		flood = 1
	elif cur == "fire":
		fire = 1
	elif cur == "earthquake":
		earthQuake = 1


res = str(flood) + " " + str(fire) + " " + str(earthQuake)

print (res)