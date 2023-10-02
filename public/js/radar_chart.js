//mapping values of FRs to integer, like SL0 will mapped to 0, SL1 will mapped to 1 and so on
Chart.defaults.color = '#fff';
document.addEventListener('DOMContentLoaded', function() {
    // create a radar chart of SL levels mapped fr_values
    const total_sr = [24,24,19,6,11,3,13];
    const usr_sr_score = get_user_sr_score();
    const final_score = [0,0,0,0,0,0,0];
    for(let i=0; i<7; i++){
        final_score[i] = Math.floor((usr_sr_score[i]/total_sr[i])*100).toString() + "%";
    }
    const usr_data = get_sl_values_data();
    const tsl = get_tsl_data();
    var ctx = document.getElementById('chart-SL-canvas');
    var chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["IAC " + final_score[0] , "UC " + final_score[1] ,"SI " + final_score[2] ,"DC " + final_score[3],"RDF " + final_score[4],"TRE " + final_score[5],"RA " + final_score[6] ],
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
                    'rgba(0,152,128, 0.5)',
                ],
                borderColor: [
                    'rgba(0,152,128, 1)',
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
                    suggestedMin: -1,
                    suggestedMax: 4,
                    ticks: {
                        stepSize: 1,
                        color: 'white', // White font color
                        backdropColor:'transparent',
                        fontSize: 20,
                        callback: (val) => {
                            return 'SL' + val;}
                        
                    }
                }
            }
        }
    });
});