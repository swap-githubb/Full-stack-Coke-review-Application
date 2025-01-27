let chart;

async function fetchPollData() {
    try {
        const response = await fetch('http://localhost:3000/flavors');
        let data = await response.json();

        data = data.map(flavor => ({
            name: flavor.name,
            votes: flavor.y
        }));

        if (chart) {
            // Updates chart with new data
            console.log('Updating chart');
            updateChart(data);
        } else {
            // Creates new chart if doesn't exist yet
            console.log('Creating chart');
            createChart(data);
        }
    } catch (error) {
        console.error('Error fetching poll data:', error);
    }
}

function createChart(data) {
    console.log(data);

    const ctx = document.getElementById('container').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'bar',  // 'bar', 'line', 'pie', etc.
        data: {
            labels: data.map(flavor => flavor.name),  // x-axis labels
            datasets: [{
                label: 'Votes',
                data: data.map(flavor => flavor.votes),  // y-axis data
                backgroundColor: '#d43a41',
                borderColor: '#a32a2f',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Flavor'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Votes'
                    }
                }
            }
        }
    });
}

function updateChart(data) {
    if (chart) {
        chart.data.labels = data.map(flavor => flavor.name);
        chart.data.datasets[0].data = data.map(flavor => flavor.votes);
        chart.update(); // Re-renders the chart with new data
        console.log('Chart updated');
    }
}

// Submits vote and fetches new data after submitting
document.getElementById('poll-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const selectedFlavor = document.querySelector('input[name="flavor"]:checked')?.value;

    if (!selectedFlavor) {
        alert('Please select a flavor');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/poll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ flavor: selectedFlavor })
        });

        // Fetches updated data
        fetchPollData();
    } catch (error) {
        console.error('Error submitting vote:', error);
    }

    alert('Thank you for voting!');
});

//Review submission
document.getElementById('resub').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('Review submission in process....');
    const rv = document.getElementById('Re').value;
    console.log(rv);
    if (!rv) {
        alert('Please add a review');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({review : rv })
        });

        document.getElementById('Re').value = '';

    } catch (error) {
        console.error('Error submitting review:', error);
    }
    alert('Thank you for you review!!');
});


window.onload = fetchPollData;
