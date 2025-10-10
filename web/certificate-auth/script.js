        document.getElementById('verificationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const internName = document.getElementById('internName').value.toLowerCase().replace(/\s/g, '_');
        const internshipDuration = document.getElementById('internshipDuration').value;
        const internRole = document.getElementById('internRole').value;
        
        const internsData = {
            "2401": {
                name: "Creta",
                duration: "June - August",
                role: "Designer"
            },
            "2402": {
                name: "Himangi Tripathy",
                duration: "June - August",
                role: "Designer"
            },
            
        };
    
       
        const intern = internsData[internName];
        const isValid = intern && 
                        intern.duration === internshipDuration && 
                        intern.role === internRole;
                        let certificate ;
        if (isValid) {

                            if(internName == 2401){
                                document.getElementById('result').innerHTML = `
                                <h2>Certificate Verified</h2>
                                <p><strong>Name:</strong> ${intern.name}</p>
                                <p><strong>Duration:</strong> ${intern.duration}</p>
                                <p><strong>Role:</strong> ${intern.role}</p>
                                <a href="certificates/creta.html">see certificate</a>
                                `;

                            }else if(internName == 2402){
                                document.getElementById('result').innerHTML = `
                                <h2>Certificate Verified</h2>
                                <p><strong>Name:</strong> ${intern.name}</p>
                                <p><strong>Duration:</strong> ${intern.duration}</p>
                                <p><strong>Role:</strong> ${intern.role}</p>
                                <a href="certificates/himangi.html">see certificate</a>
                                `;
                            }
        } else {
            document.getElementById('result').innerHTML = `<p>Certificate not found. Please check the details.</p>`;
        }
    });