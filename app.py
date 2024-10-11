from flask import Flask, render_template, request, jsonify
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

app = Flask(__name__)


# TODO: Fetch dataset, initialize vectorizer and LSA here
newsgroups = fetch_20newsgroups(subset='all')
documents = newsgroups.data
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(documents)
n_components = 110  # Adjust the number of components as needed
lsa_model = TruncatedSVD(n_components=n_components)
lsa_matrix = lsa_model.fit_transform(tfidf_matrix)

def search_engine(query):
    """
    Function to search for top 5 similar documents given a query
    Input: query (str)
    Output: documents (list), similarities (list), indices (list)
    """
    # TODO: Implement search engine here
    # return documents, similarities, indices 
    # Step 4: Transform the query using the same TF-IDF vectorizer and LSA model
    # Step 4: Transform the query using the same TF-IDF vectorizer and LSA model
    query_tfidf = vectorizer.transform([query])
    query_lsa = lsa_model.transform(query_tfidf)
    
    # Step 5: Calculate cosine similarity between query and all documents
    similarities = cosine_similarity(query_lsa, lsa_matrix)[0]
    
    # Step 6: Get top 5 most similar documents
    top_indices = similarities.argsort()[::-1][:5]
    top_docs = [documents[i] for i in top_indices]
    top_similarities = [round(similarities[i], 4) for i in top_indices]

    # Ensure indices and similarities are Python lists, not NumPy arrays
    return top_docs, top_similarities, top_indices.tolist() 
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():

    query = request.form['query']
    print(f"Received query: {query}")
    documents, similarities, indices = search_engine(query)
    print(f"Documents: {documents}, Similarities: {similarities}, Indices: {indices}")  # Debugging line
    return jsonify({'documents': documents, 'similarities': similarities, 'indices': indices}) 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
