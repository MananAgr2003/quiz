//mapping values of FRs to integer, like SL0 will mapped to 0, SL1 will mapped to 1 and so on
Chart.defaults.color = '#fff';
document.addEventListener('DOMContentLoaded', function() {
    // create a radar chart of SL levels mapped fr_values
    const total_sr = [24,24,19,6,11,3,13];
    const usr_sr_score = get_user_sr_score();
    const final_score = [0,0,0,0,0,0,0];
    for(let i=0; i<7; i++){
        final_score[i] = "FR"+i.toString()+" "+Math.floor((usr_sr_score[i]/total_sr[i])*100).toString() + "%";
    }
    const usr_data = get_sl_values_data();
    const tsl = get_tsl_data();
    var ctx = document.getElementById('chart-SL-canvas');
    var chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: final_score,
            borderColor:'white',
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
                        display: false
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 1)',
                    },
                    suggestedMin: 0,
                    suggestedMax: 4,
                    ticks: {
                        stepSize: 1,
                        color: 'white', // White font color
                        backdropColor:'transparent',
                        fontSize: 20
                    }
                }
            }
        }
    });
});