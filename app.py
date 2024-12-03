from flask import Flask, request, jsonify
import subprocess
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/query', methods=['POST'])
def query():
    
    query = request.json.get('query', None)

    if query is None:
        return jsonify({"error": "No query provided"}), 400

    # path to leventis' script
    script_path = "/home/ckapsalis/search_engine/vector_space_retrieval_csv/vsr/__main__.py"
   
    command = ['python', script_path, '--mode', 'user', query]

    try:
        #capture output 
        result = subprocess.run(command, capture_output=True, text=True, check=True)

        # returning the output as the response
        return jsonify({"result": result.stdout.strip()})

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Error running script: {e.stderr}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)