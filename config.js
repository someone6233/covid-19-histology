/* ======================================================================
   CONFIG: every word a student reads, the track list, the playlist songs,
   the bug reports, the sorting cards, the lung presets and the quiz.
   Edit the words here; the other JS files do not need changes.
   ====================================================================== */

var ARTIST = 'Histology';

/* The six tracks. Each one is a "song" on the album. */
var TRACKS = [
 {title:'What is happening?', tag:'Which organelle is failing?', dur:'4:00', line:'COVID-19 causes errors inside the cell. Are you able to find organelle behind each bug?'},
 {title:'Organization!', tag:'Cells, tissues, organs, systems', dur:'4:00', line:'Try to drag each COVID-19 symptom to the level of organization it comes from.'},
 {title:'Oh no, infection :(', tag:'COVID-19 invasion', dur:'4:30', line:'How the virus enters the cell. Let us learn!'},
 {title:'Lung Infection', tag:'How COVID-19 changes the lungs', dur:'4:00', line:'See what happens to the lungs in a COVID-19 infection'},
 {title:'Symptom Playlist', tag:'Symptoms and the immune response', dur:'5:00', line:'Search for symptoms, build a playlist, then balance the immune response.'},
 {title:'Your Wrapped', tag:'Review and your Wrapped', dur:'4:00', line:'Guess the song in the quiz, then see your Wrapped (not condoned by Spotify).'}
];

/* ======================================================================
   Track 1 and Track 3: parts of the cell
   ====================================================================== */
var CELL_PARTS = {
  membrane:{name:'Cell membrane', job:'Controls what gets in and out of the cell', tw:'Some membrane proteins act as docking sites. In COVID-19, its spike protein binds to a membrane protein called ACE2 on certain cells.'},
  cytoplasm:{name:'Cytoplasm', job:'A jelly-like fluid where many chemical reactions happen (basically what gives me nightmares in biochemistry)', tw:'Once the virus gets in, its RNA (just instructions, basically) is released into the cytoplasm. After, the cell’s ribosomes read it and build virus proteins there.'},
  nucleus:{name:'Nucleus', job:'Holds the DNA instructions for the cell', tw:'Most of the virus’s action happens in the cytoplasm, not the nucleus. The virus disrupts the cell’s normal instructions, so the cell spends its effort making virus parts.'},
  mito:{name:'Mitochondria', job:'Makes energy (ATP) from food and oxygen (yay energy!)', tw:'Making many virus copies uses a lot of energy. Moreover, infection can also stress the mitochondria, so the cell cannot make enough energy (so sad).'}
};

/* ======================================================================
   Track 1: Cell Bug Report
   Each bug is a symptom of the cell's error. The student finds the organelle.
   ====================================================================== */
var BUGS = [
  {report:'The cell is making lots of virus copies, but its the amount of energy is still dropping. It cannot keep up with its normal jobs.', part:'mito', hint:'Which part makes the cell’s energy?', why:'Mitochondria make ATP. Copying viruses uses lots of energy. Therefore, COVID-19 infection can stress the mitochondria because of overproduction.'},
  {report:'The virus’s instructions are being read, but the cell’s normal instructions are being ignored.', part:'nucleus', hint:'Which part holds the cell’s instruction library?', why:'The nucleus holds the DNA instructions. COVID-19 infection disrupts how the cell uses its normal instructions.'},
  {report:'A virus spike has locked onto a docking protein. Infection can only start here if the lock fits.', part:'membrane', hint:'Which part is the outer boundary of the cell?', why:'The cell membrane holds ACE2 docking proteins. The spike protein binds to ACE2 to start infection.'},
  {report:'Virus RNA is being read in the jelly-like fluid, and new virus proteins are being built there.', part:'cytoplasm', hint:'Which part fills the inside of the cell?', why:'Ribosomes in the cytoplasm read the virus RNA and build virus proteins. New virus copies are assembled there too.'}
];

/* ======================================================================
   Track 2: Sort the Symptoms
   lv = level of organization: 0 cell, 1 tissue, 2 organ, 3 organ system
   ====================================================================== */
var LEVELS = ['Cell', 'Tissue', 'Organ', 'Organ system'];
var SORT_CARDS = [
  {t:'Virus RNA hijacks the cell’s ribosomes', lv:0, why:'This happens inside one cell.'},
  {t:'Infected cells burst and release new viruses', lv:0, why:'A single cell bursts, which spreads the infection to its neighbors.'},
  {t:'Lining cells die, leaving gaps in the air sac wall', lv:1, why:'Many similar lining cells form a tissue. Damage across the tissue leaves gaps.'},
  {t:'Fluid and immune cells fill the air sacs', lv:1, why:'The air sac tissue fills with fluid and immune cells.'},
  {t:'Swollen lungs cannot move as much oxygen into the blood', lv:2, why:'The lungs are an organ made of several tissues. If these are impaired, the whole organ does not work as well.'},
  {t:'Chest tightness from inflamed lungs', lv:2, why:'Inflammation in the whole lung organ causes the tightness.'},
  {t:'Coughing as air moves in and out of the airways', lv:3, why:'Nose, windpipe, lungs and diaphragm work together as the respiratory system.'},
  {t:'Short of breath and tired as the body works harder', lv:3, why:'The respiratory system and the rest of the body respond together, ao this would represent an organ system.'}
];

/* ======================================================================
   Track 3: the virus’s choices inside the cell
   ====================================================================== */
var HIJACK = [
  {q:'The virus’s RNA is inside the cell. Where is it read to make virus proteins?', a:['Cytoplasm, by ribosomes','The nucleus','Inside the mitochondria only'], e:'Ribosomes in the cytoplasm read the virus RNA. Most of this happens outside the nucleus.'},
  {q:'Building many copies uses a lot of energy. Which organelle makes the energy?', a:['Mitochondria','Nucleus','Cell Membrane'], e:'Mitochondria make ATP. Heavy virus copying drains the cell’s energy.'},
  {q:'The cell is now full of new virus particles. What happens next?', a:['The cell bursts and releases new viruses','The virus turns into a red blood cell','Nothing'], e:'When the cell bursts, new viruses can infect neighboring cells.'},
  {q:'Infected cells send alarm signals. Which immune cell can find and destroy infected cells?', a:['Killer T cell','Red blood cell','Lining cell'], e:'Killer T cells (literally just an immune cell) find infected cells and destroy them before they make many more copies.'}
];
var TAKEOVER_STEPS = [
  {h:'1. Dock', t:'The virus’s spike fits into an ACE2 docking protein on the cell membrane.'},
  {h:'2. Enter', t:'The cell takes the virus in. Now it is inside the cytoplasm.'},
  {h:'3. Copy', t:'Choose the right move at each step. Every wrong move drains the cell’s energy.'},
  {h:'4. Burst', t:'The cell is damaged. Immune cells can clear infected cells before they spread.'}
];

/* ======================================================================
   Track 4: Lung Mixer presets. Each dial is 0 to 100.
   fluid = fluid filling the air sacs
   infected = share of lining cells infected
   inflam = strength of immune response and inflammation
   ====================================================================== */
var LUNG_PRESETS = {
  healthy:{name:'Healthy', fluid:0, infected:0, inflam:10},
  mild:{name:'Mild infection', fluid:15, infected:20, inflam:35},
  moderate:{name:'Moderate', fluid:40, infected:45, inflam:60},
  severe:{name:'Severe', fluid:75, infected:70, inflam:90},
  recovering:{name:'Recovering', fluid:10, infected:5, inflam:20}
};

/* ======================================================================
   Track 5: the Symptom Playlist songs
   keys = words that make the song show up in search
   ok = true means it is a real COVID-19 symptom. false is the trap.
   ====================================================================== */
var SONGS = [
  {title:'Coughing', artist:'Lungs', keys:['cough','coughing'], ok:true, note:'The infection irritates the airway lining, therefore, coughing is the body trying to clear mucus and debris from the airways.'},
  {title:'Trouble Breathing', artist:'Bad Gas Exchange', keys:['breath','breathe','short of breath'], ok:true, note:'Fluid and swelling in the air sacs leave less room for oxygen to reach the blood, therefore, breathing feels harder.'},
  {title:'Fever', artist:'Intense Immune Response', keys:['fever','hot'], ok:true, note:'Immune signals tell the brain to raise the body’s temperature because this can help the immune cells/enzymes to work better and can kill the virus faster and slow them down.'},
  {title:'No Energy', artist:'Mitochondrial Dysfunction', keys:['tired','fatigue','energy'], ok:true, note:'Fighting an infection uses lots of energy, and infected cells may become stressed. We talked about how this has to do with the mitochondria.'},
  {title:'Lack of Smell', artist:'Nose Lining Damaged', keys:['smell','taste'], ok:true, note:'The virus can infect support cells in the lining of the nose, which can disrupt smell (same goes with tastebuds in the mouth, as you may be aware of).'},
  {title:'Chest Tightness', artist:'Lung Tissue', keys:['chest'], ok:true, note:'Inflamed lung tissue and irritated airways can cause chest tightness or pain.'},
  {title:'Sore Throat', artist:'Upper Airway', keys:['throat'], ok:true, note:'The upper airway lining is often the first place the virus infects, so therefore, this area can feel sore.'},
  {title:'Ankle Sprain', artist:'Ligament Band', keys:['ankle','sprain'], ok:false, note:'Definitely not a COVID-19 symptom, since they are not really related to the virus here. A sprain is an injury to ligaments (maybe what happens when you twist your ankle).'}
];
var PLAYLIST_GOAL = 6;

/* ======================================================================
   Track 6: Guess-the-Song quiz (first answer in each list is correct)
   ====================================================================== */
var QUIZ = [
  {q:'Which organelle makes most of the cell’s energy?', a:['Mitochondria','Nucleus','Cell membrane','Cytoplasm'], e:'Mitochondria turn food (glucose) and oxygen into energy the cell can use.'},
  {q:'Which part of the cell holds the DNA instructions?', a:['Nucleus','Cytoplasm','Cell membrane','Mitochondria'], e:'The nucleus stores the DNA instructions for the cell.'},
  {q:'Which structure has the ACE2 docking proteins that the spike protein binds to?', a:['Cell membrane','Nucleus','Mitochondria','Cell wall'], e:'The membrane holds ACE2 proteins, which the spike protein can grab.'},
  {q:'Where is the virus’s RNA read to make virus proteins?', a:['In the cytoplasm','Only in the nucleus','In the air sacs','In red blood cells'], e:'Ribosomes in the cytoplasm read the viral RNA.'},
  {q:'A group of similar cells that work together is called a…', a:['Tissue','Organelle','Organ system','Nucleus'], e:'Lung lining cells team up to form lung lining tissue.'},
  {q:'The lungs are made of several tissues working together. That makes them…', a:['An organ','A single cell','An organelle','A membrane'], e:'Organs are made of different tissues. Organs team up in organ systems.'},
  {q:'Why does fluid in the air sacs make breathing hard?', a:['Oxygen cannot easily get through to the blood','The lungs get too much oxygen','The nucleus stops working','The cells grow extra mitochondria'], e:'Air sacs need to be open for better oxygen exchange, so then, easier breathing in return.'},
  {q:'Which immune cell can find and destroy infected cells?', a:['Killer T cell','Red blood cell','Lining cell','Mitochondria'], e:'Killer T cells remove infected cells before they make many more copies.'}
];