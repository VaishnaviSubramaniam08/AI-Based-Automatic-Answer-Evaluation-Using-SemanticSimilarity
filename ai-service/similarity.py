import sys
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

print("Loading Sentence-BERT model 'all-MiniLM-L6-v2'...", flush=True)
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Model loaded successfully!", flush=True)
except Exception as e:
    print(f"Error loading model: {e}", file=sys.stderr, flush=True)
    model = None

def calculate_similarity(reference, student):
    """
    Calculates the semantic similarity between the reference answer and student answer.
    Returns a float similarity score between 0.0 and 1.0 (or negative if opposite, capped to 0.0).
    """
    if not model:
        raise RuntimeError("SentenceTransformer model is not loaded.")
        
    # Generate embeddings for both texts
    embeddings = model.encode([reference, student])
    
    # Compute cosine similarity
    similarity_matrix = cosine_similarity([embeddings[0]], [embeddings[1]])
    similarity_score = float(similarity_matrix[0][0])
    
    # Map any negative values to 0.0, cap max to 1.0
    return max(0.0, min(1.0, similarity_score))
