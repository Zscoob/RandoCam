const ipsum = 'Lorem ipsum Mel Fisher florida straights coast guard civil war palm tree dive Captain Eric reef sailfish boat starboard sailing Over-Sea Railroad stock island boca grand Truman Annex Harry Truman one human family mallory square port cow key Thomas Edison sub-tropical southernmost city eagle dredgers key sunset celebration west martillo treasure parrot heads island key deer Ernest Hemingway web development new town homeless buoy Matthew C. Perry fish channel simonton yellow tail sun tan queen conch ship wreck power boat races laid back bight coconut trees Lou Gehrig snorkel hurricane christmas tree island US 1 chickens old town smathers beach harbor dingy Spanish galleon Santa Margarita Key West ipsum wisteria island Whitehead Street little white house eastern dry rocks lobster beach Key West Pink Shrimp conch cuban chug. Lorem ipsum Treasure port mile zero Matthew C. Perry bone cay Key West roosters reef cow key higgs beach christmas tree island schooner wharf key lime Captain Eric hammock cafe con leche Fort Jefferson parrot heads Key West ipsum sand key mangroves star fish Fort Zachary coconut trees new town tank island conch fritters US 1 Lou Gehrig mel fisher stern music web design dredgers key yellow tail gay fishing conch republic sun queen conch Laid Back Key West conch sunset shipwreck harbor watersports bight sunset key buoy Spanish galleon Santa Margarita eastern dry rocks palm tree';
console.log(ipsum.split(' ').map((word, index) => `INSERT INTO comments (video_id, text, handle, timeStamp) VALUES(0, '${word}', 'Anonymous', ${index}); INSERT INTO dreamfield (id) VALUES(${index});`).join('\n'));