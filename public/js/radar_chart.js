//mapping values of FRs to integer, like SL0 will mapped to 0, SL1 will mapped to 1 and so on
document.addEventListener('DOMContentLoaded', function() {
    // create a radar chart of SL levels mapped fr_values
    const usr_data = get_sl_values_data();
    const tsl = get_tsl_data();
    var ctx = document.getElementById('chart-SL-canvas');
    var chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['FR1', 'FR2', 'FR3', 'FR4', 'FR5', 'FR6', 'FR7'],
            datasets: [
                {
                    label: 'SL-Target',
                    data: tsl,
                    backgroundColor: [
                        'rgba(68,114,196,0)',
                    ],
                    borderColor: [
                        'rgb(68,114,196)',
                    ],
                    borderWidth: 1
                },
                {
                label: 'SL-Achieved',
                data:usr_data,
                backgroundColor: [
                    'rgba(237,125,49,0)',
                ],
                borderColor: [
                    'rgb(237,125,49)',
                ],
                borderWidth: 1
            },
        ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            borderWidth: 3,
            plugins: {
                legend: {
                    display: true,
                },
                title: {
                    display: true,
                    text: 'Security Level'
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 4,
                    ticks: {
                        stepSize: 1,
                        color: 'rgba(255, 255, 255, 1)', // White font color
                    }
                }
            }
        }
    });
});