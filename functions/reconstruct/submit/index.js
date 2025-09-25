function getSolution(recon,scramble) {
	recon = JSON.parse(recon)
	let nums, inspection, zRotation
	let solution = "";
	let flipped = 0;

	// converts text scramble to list of 14 numbers
	function convert(s) {
	    let n = Array(14).fill(0);
	    const effects = [[0, 9, 11, 12], [6, 11, 12, 13], [8, 10, 11, 13], [2, 9, 10, 11], [0, 2, 9, 10, 11, 12], [0, 6, 9, 11, 12, 13], [6, 8, 10, 11, 12, 13], [2, 8, 9, 10, 11, 13], [0, 2, 6, 8, 9, 10, 11, 12, 13], [0, 1, 2, 3, 4, 5], [1, 2, 4, 5, 7, 8], [3, 4, 5, 6, 7, 8], [0, 1, 3, 4, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7, 8]]
	    const moves = ["5-", "4-", "3-", "2-", "1-", "0+", "1+", "2+", "3+", "4+", "5+", "6+"];
	    const scr = s.split(" ");
	    scr.splice(9, 1);
	    for (let i = 0; i < 14; i++) {
		for (let x = 0; x < effects[i].length; x++) {
		    let moveIndex = moves.indexOf(scr[i].slice(-2));
		    if (i <= 8 && [0, 2, 6, 8].includes(effects[i][x])) {
			n[effects[i][x]] -= moveIndex - 5;
		    } else {
			n[effects[i][x]] += moveIndex - 5;
		    }
		}
	    }
	    return n.map(num => ((num + 144) % 12));
	}
	
	try {
		nums = convert(scramble);
	}
	catch {return 'scramble error';}


	try {
		// this section figures out what the inspection rotations are
		let zRotation = recon[0][2][10];
		recon[0][2] = recon[0][2].map(item => item === 12 ? 0 : item);
		let y2 = [0 - nums[2], nums[9], 0 - nums[0], nums[10], nums[11], nums[12], 0 - nums[8], nums[13], 0 - nums[6]].map(num => (num + 144) % 12);
		//console.log('a',recon[0][2].slice(0,9))
		//console.log('b',nums.slice(0,9))
		//console.log('c',y2)
		if (JSON.stringify(recon[0][2].slice(0,9)) == JSON.stringify(nums.slice(0,9))) {
			inspection = ["","z","z2","z'"][zRotation];
		}
		else if (JSON.stringify(recon[0][2].slice(0,9)) == JSON.stringify(y2)) {
			inspection = "x2 " + ["z2","z'","","z"][zRotation];
			if (inspection == "x2 z2") {
				inspection = "y2";
			}
			if (inspection == "x2 ") {
				inspection = "x2";
			}
		}
		else {
			return 'inspection error';
		}

		
		// this function takes the list of moves and times, sorts them by time, figures out which moves are simul, and returns a human readable solution.
		// it is ran after going through the entire recon list and after flips so that moves before and after a flip aren't considered simul somehow
		function combine(l) {
			let turnNames = ['6-','5-','4-','3-','2-','1-','0+','1+','2+','3+','4+','5+','6+'];
			l.sort((a, b) => a[0] - b[0]);
			//console.log(l)
			for (let i=0;i<l.length;i++) {
				// simul move
				if (!(i == l.length - 1) && l[i][2]==l[i+1][2] && l[i][4]!=l[i+1][4] && l[i][1] + 0.2 > l[i+1][0]) {
					if ((l[i][4] == 0 && !["UR","DR","R","dl","ul","/","D"].includes(l[i][2])) || (l[i][4] == 1 && ["UR","DR","R","dl","ul","/","D"].includes(l[i][2]))) {
						solution += l[i][2] + "(" + turnNames[l[i][3]+6] + "," + turnNames[l[i+1][3]+6] + ") ";	
					}
					else {
						solution += l[i][2] + "(" + turnNames[l[i+1][3]+6] + "," + turnNames[l[i][3]+6] + ") ";	
					}
					i+=1;
				}
				// single move
				else {
					if (l[i][4] == 0) {
						solution += l[i][2] + turnNames[l[i][3]+6] + " ";	
					}
					else if (["UR","DR","R","dl","ul","/","D"].includes(l[i][2])) {
						solution += l[i][2] + "(" + turnNames[l[i][3]+6] + ",0+) ";	
					}
					else {
						solution += l[i][2] + "(0+," + turnNames[l[i][3]+6] + ") ";	
					}
				}
			}
			solution = solution.replace(/slash/g,'/').replace(/back/g,'\\')
			moveList = []
		}
		let moveList = [] // each item in moveList has the following format: [start,end,move,amount,side]
		for (let i=0; i<recon.length; i++) {
			// sets
			if (recon[i][1] == "set") {
			}
			// flips
			else if (recon[i][2] == "flip") {
				combine(moveList);
				flipped = (flipped + 1) % 2;
				solution += recon[i][3] + " ";
			}
			// moves
			else {
				let code = ""
				let side = 1
				if (recon[i][2].includes(0)) {
					code+=1
				}
				else {
					code+=0
				}
				if (recon[i][2].includes(2)) {
					code+=1
				}
				else {
					code+=0
				}
				if  (recon[i][2].includes(6)) {
					code+=1
				}
				else {
					code+=0
				}
				if (recon[i][2].includes(8)) {
					code+=1
				}
				else {
					code+=0
				}
				for (let p=0; p<recon[i][2].length; p++) {
					if ([1,3,4,5,7].includes(recon[i][2][p])) {
						side = 0; // 0=front, 1=back
					}
				}
				if (side == 1) {
					code = code.replace(/1/g,'a').replace(/0/g,'1').replace(/a/g,'0')
				}
				if (flipped == 1) {
					code = code[2]+code[3]+code[0]+code[1];
				}
				// figures out what the pin position is based on the code and the rotation 
				let codeMoves = {
					'1000': [ 'UL', 'UR', 'DR', 'DL' ],
					'1001': [ 'back', 'slash', 'back', 'slash' ],
					'1010': [ 'L', 'U', 'R', 'D' ],
					'1011': [ 'ur', 'dr', 'dl', 'ul' ],
					'1100': [ 'U', 'R', 'D', 'L' ],
					'1101': [ 'dl', 'ul', 'ur', 'dr' ],
					'1110': [ 'dr', 'dl', 'ul', 'ur' ],
					'1111': [ 'ALL', 'ALL', 'ALL', 'ALL' ],
					'0100': [ 'UR', 'DR', 'DL', 'UL' ],
					'0001': [ 'DR', 'DL', 'UL', 'UR' ],
					'0010': [ 'DL', 'UL', 'UR', 'DR' ],
					'0101': [ 'R', 'D', 'L', 'U' ],
					'0011': [ 'D', 'L', 'U', 'R' ],
					'0111': [ 'ul', 'ur', 'dr', 'dl' ],
					'0110': [ 'slash', 'back', 'slash', 'back' ],
					'0000': [ 'all', 'all', 'all', 'all' ]
				}	
				if (flipped == 0) {
					moveList.push([recon[i][0],recon[i][1],codeMoves[code][zRotation],recon[i][3],side]);
				}
				else {
					moveList.push([recon[i][0],recon[i][1],codeMoves[code][zRotation],recon[i][3]*-1,side]);
				}
			}
		}
		combine(moveList)


	}
	catch (error){return error;}

	return [inspection,solution.slice(0,-1)]
}

export async function onRequest(context) {
    let cookieHeader = context.request.headers.get('cookie');

    if (!cookieHeader) {
        return new Response("Please open clockdb.net/login in a new window, login, and reclick the submit button. Contact me if this issue persists.");
    }
    else {
        // Parse the cookie string to individual cookies
        const cookies = cookieHeader.split(';').reduce((cookiesObject, cookie) => {
            let [name, value] = cookie.split('=').map(c => c.trim());
            cookiesObject[name] = value;
            return cookiesObject;
        }, {});

        // Check the auth cookie
        const key = cookies['auth'];
        if (key == null) {
            return Response.redirect("https://clockdb.net/login", 303);
        }
        const ps = context.env.db.prepare('SELECT name,wcaid FROM users WHERE key=?').bind(key)
        let data = await ps.first();
        if (data == null) {
            return new Response("Please open clockdb.net/login in a new window, login, and reclick the submit button. Contact me if this issue persists.");
        }


		
        // Getting various pieces of info for the reconstruction
        let d, idValue, name, timerStart, startTime, time, solveDate, compName, compLink, tags
        // I can/should probably move some of these try catches because they don't do anything. parseFloat returns NaN not an error.
        try {
            d = JSON.parse(cookies['reconData']);
            idValue = Date.now();
            name = data.name;
        } catch (error) {
            return new Response("Error. Please contact me if this issue persists.");
        }
		// tries to set pins
		try {
			let first_move = d.recon[1][2];
			let pins = [
				first_move.includes(0) ? 1 : 0,
				first_move.includes(2) ? 1 : 0,
				first_move.includes(6) ? 1 : 0,
				first_move.includes(8) ? 1 : 0
			];
			//back move
			if (!first_move.includes(4)) {
				pins = pins.map(pin => pin === 0 ? 1 : 0);
			}
			if (d.recon[0].length < 4) {
				d.recon[0].push(pins);
			} else {
				d.recon[0][3] = pins;
			}
		}
		catch (error) {}
        try {
            timerStart = parseFloat(d['timerStart']);
            startTime = Math.floor(timerStart - .3);
        } catch (error) {
            return new Response("There is an error with the start time you entered. Contact me if this issue persists.");
            // Code to handle the exception
        }
        try {
            time = parseFloat(d['solveTime']).toFixed(2);
        } catch (error) {
            return new Response("There is an error with the solve time you entered. Contact me if this issue persists.");
        }
        try {
            let date = new Date(Date.parse(d["solveDate"]));
            let options = { year: 'numeric', month: 'long', day: 'numeric' };
            solveDate = date.toLocaleDateString("en-US", options);
        } catch (error) {
            return new Response("There is an error with the date entered. This is an unusual error, please contact me.");
        }
        if (d["officialStatus"] == "Official") {
            tags = '['
            // if record add tags
            compName = d["compName"];
            compLink = d["compLink"];
            tags += '["Official","gray"],';
        }
        else {
            compName = "home (unofficial)";
            compLink = "https://www.youtube.com/watch?v=" + d["vidId"];
            tags = '[["Unofficial","gray"],';
        }
        if (d['methodUsed'] == "7s") {
            tags += '["7-Simul","mediumpurple"],';
        }
        if (d['methodUsed'] == "flip") {
            tags += '["Flip","lightgreen"],';
        }
        else if (d['methodUsed'] == "7sf") {
            tags += '["7sfndmw4lm","lightpink"],';
        }
        tags += '["Single","gray"]]';


        let inspectionAndSolution;
        try {
            inspectionAndSolution = getSolution(JSON.stringify(d['recon']),d['solveScramble'].trim());
        }
        catch {
            inspectionAndSolution = ['this failed for some reason','error'];
        }

        // Add data to the queue
        const ps2 = context.env.db.prepare(`
            INSERT INTO queue (
                num, name, title, wcaid, id, recon, startTime, endTime,
                solveStart, tags, scramble, inspection, solution, date,
                competitionName, competitionLink, author, authorId, average
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            idValue, d['solverName'].trim(), "" + time + ' Single', d['solverWCAID'].trim(), d['vidId'], JSON.stringify(d['recon']), startTime, null,
            JSON.stringify([timerStart,parseFloat(time)]), tags, d['solveScramble'].trim(), inspectionAndSolution[0], inspectionAndSolution[1], solveDate,
            compName.trim(), compLink.trim(), name, null, null
        );
        await ps2.all();

		// add data to archive (so that the data is saved if I accidentally delete it from the queue)
        const ps3 = context.env.db.prepare(`
            INSERT INTO archive (
                num, name, title, wcaid, id, recon, startTime, endTime,
                solveStart, tags, scramble, inspection, solution, date,
                competitionName, competitionLink, author, authorId, average
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            idValue, d['solverName'].trim(), "" + time + ' Single', d['solverWCAID'].trim(), d['vidId'], JSON.stringify(d['recon']), startTime, null,
            JSON.stringify([timerStart,parseFloat(time)]), tags, d['solveScramble'].trim(), inspectionAndSolution[0], inspectionAndSolution[1], solveDate,
            compName.trim(), compLink.trim(), name, null, null
        );
        await ps3.all();

		// add data to saved recons (so you can edit your most recent submission)
		const ps4 = context.env.db.prepare(`
            INSERT INTO saved (
                num, id, recon, name, time, method, wcaid, scramble, startTimestamp, date, official, competitionName, competitionLink, authorId
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            idValue, d['vidId'], JSON.stringify(d['recon']), d['solverName'].trim(), d['solveTime'], d['methodUsed'], d['solverWCAID'].trim(), d['solveScramble'].trim(), d['timerStart'], d['solveDate'], d['officialStatus'], d['compName'].trim(), d['compLink'].trim(), data.wcaid
        );
        await ps4.all();
        return new Response('Success! Once the reconstruction has been reviewed it will be added to the site (<24 hours). If you make any edits, resubmit the reconstruction.')
    }
}