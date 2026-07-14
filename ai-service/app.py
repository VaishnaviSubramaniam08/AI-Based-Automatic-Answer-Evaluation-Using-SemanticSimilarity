import os
from flask import Flask, request, jsonify
from similarity import calculate_similarity

app = Flask(__name__)

# Basic landing check
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "AI Answer Similarity Service",
        "model": "all-MiniLM-L6-v2"
    }), 200

@app.route('/evaluate', methods=['POST'])
def evaluate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON request body"}), 400
            
        reference = data.get("reference")
        student = data.get("student")
        
        if reference is None or student is None:
            return jsonify({"error": "Both 'reference' and 'student' answers must be provided"}), 400
            
        # Clean inputs (strip whitespace)
        reference_str = str(reference).strip()
        student_str = str(student).strip()
        
        # Calculate similarity
        score = calculate_similarity(reference_str, student_str)
        
        return jsonify({
            "similarity": score
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Flask AI Service on port {port}...", flush=True)
    app.run(host='0.0.0.0', port=port, debug=False)
