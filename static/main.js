document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    let query = document.getElementById('query').value;
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'query': query
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayResults(data);
        displayChart(data);
    });
});

function displayResults(data) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Results</h2>';
    for (let i = 0; i < data.documents.length; i++) {
        let docDiv = document.createElement('div');
        docDiv.innerHTML = `<strong>Document ${data.indices[i]}</strong><p>${data.documents[i]}</p><br><strong>Similarity: ${data.similarities[i]}</strong>`;
        resultsDiv.appendChild(docDiv);
    }
}

function displayChart(data) {
    // Input: data (object) - contains the following keys:
    //        - documents (list) - list of documents
    //        - indices (list) - list of indices   
    //        - similarities (list) - list of similarities
    // TODO: Implement function to display chart here
    //       There is a canvas element in the HTML file with the id 'similarity-chart'
    // Get the canvas element where the chart will be rendered
    let ctx = document.getElementById('similarity-chart').getContext('2d');
    
    // Destroy the old chart instance if it exists
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Create a new Chart.js bar chart
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.indices.map(index => `Document ${index}`),  // Labels for each document
            datasets: [{
                label: 'Cosine Similarity',
                data: data.similarities,  // Cosine similarity scores
                backgroundColor: 'rgba(54, 162, 235, 0.6)',  // Bar color
                borderColor: 'rgba(54, 162, 235, 1)',  // Bar border color
                borderWidth: 1  // Width of the border
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1  // Set max to 1 since cosine similarities range from 0 to 1
                }
            },
            plugins: {
                legend: {
                    display: false  // Hide the legend if not needed
                }
            }
        }
    });
}