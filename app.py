from flask import Flask, request, jsonify
import os
import csv
import constants
from langchain_community.document_loaders import TextLoader
from langchain.indexes import VectorstoreIndexCreator

# Set API Key in Environment


# Initialize Flask App
app = Flask(__name__)

# Load the document and create the index once
loader = TextLoader("instruct.txt")
index = VectorstoreIndexCreator().from_loaders([loader])

@app.route('/classify_job', methods=['POST'])
def classify_job():
    # Parse incoming JSON request
    data = request.get_json()
    
    job_title = data.get('job_title')
    job_description = data.get('job_description')

    if not job_title or not job_description:
        return jsonify({"error": "job_title and job_description are required"}), 400

    # Create the query
    my_query = f"There is an individual with the following job title: {job_title}, and provided linkedin job description: {job_description}. Return the perceived Seniority, business function and subfunction in the following format: 'Seniority';'Function';'Subfunction'"

    # Query the index
    results = index.query(my_query)
    
    # Split and structure the response
    spl_results = results.split(';')
    response = {
        'job_title': job_title,
        'job_description': job_description,
        'seniority': spl_results[0].strip(),
        'function': spl_results[1].strip(),
        'subfunction': spl_results[2].strip()
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
