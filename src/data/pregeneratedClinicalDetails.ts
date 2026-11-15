import { GeminiClinicalDetails } from '../types/medication';

/**
 * Pre-generated UK Paramedic (JRCALC) & BNF clinical details for all medications
 * across the Quick Categories (JRCALC Core Emergency, Blood Thinners, Beta Blockers,
 * and UK Starter Formulary Top 100 systemic groups).
 *
 * Stored directly in the application bundle so selecting any Quick Category medication
 * resolves instantaneously with zero Gemini API token usage.
 */
export const PREGENERATED_CLINICAL_DETAILS: Record<string, GeminiClinicalDetails> = {
  adenosine: {
    phoneticSpelling: 'a-DEN-o-seen',
    class: 'Antiarrhythmic (Endogenous Purine Nucleoside)',
    indications: [
      'Paroxysmal supraventricular tachycardia (SVT)',
      'Differential diagnosis of broad- or narrow-complex regular tachyarrhythmias',
    ],
    medicSummary:
      'Briefly blocks electrical conduction through the AV node to reset SVT back into normal sinus rhythm. Warn the patient beforehand that it causes a brief, unpleasant sensation of chest pressure, flushing, or impending doom lasting a few seconds, and record a continuous rhythm strip during rapid IV bolus administration. Contraindicated in asthma/COPD as it can trigger severe bronchospasm.',
  },
  adrenaline: {
    phoneticSpelling: 'a-DREN-a-lin',
    class: 'Sympathomimetic Catecholamine (Alpha & Beta Agonist)',
    indications: [
      'Cardiac arrest (ALS 1:10,000 IV/IO)',
      'Anaphylaxis (1:1,000 IM)',
      'Life-threatening acute asthma',
      'Severe croup (nebulised)',
    ],
    medicSummary:
      'Stimulates alpha and beta receptors to constrict blood vessels, raise blood pressure, relax airways, and support cardiac output. On scene, always verify the concentration before administration: 1:1,000 (1mg/1ml) is given IM into the anterolateral thigh for anaphylaxis, whereas 1:10,000 (1mg/10ml) is used IV/IO in cardiac arrest.',
  },
  'alendronic acid': {
    phoneticSpelling: 'al-en-DRON-ik AS-id',
    class: 'Bisphosphonate',
    indications: [
      'Postmenopausal and corticosteroid-induced osteoporosis',
      'Hip and vertebral fracture prophylaxis',
    ],
    medicSummary:
      'Slows down bone breakdown to strengthen fragile bones in patients with osteoporosis. On scene at a fall, seeing Alendronic Acid on a repeat prescription flags underlying bone fragility and an increased likelihood of hip, pelvic, or vertebral fractures even from low-energy mechanisms.',
  },
  alteplase: {
    phoneticSpelling: 'AL-te-plaze',
    class: 'Fibrinolytic (Recombinant Tissue Plasminogen Activator)',
    indications: [
      'Acute ischaemic stroke',
      'Acute ST-elevation myocardial infarction (STEMI)',
      'Massive pulmonary embolism with haemodynamic instability',
    ],
    medicSummary:
      'A potent clot-busting thrombolytic drug that dissolves fibrin blood clots. In pre-hospital or inter-facility care, monitor closely for major internal or intracranial bleeding, sudden neurological deterioration, and reperfusion arrhythmias.',
  },
  amiodarone: {
    phoneticSpelling: 'a-mee-OH-da-rone',
    class: 'Class III Antiarrhythmic',
    indications: [
      'Shock-refractory VF or pulseless VT in cardiac arrest',
      'Sustained ventricular and supraventricular arrhythmias',
    ],
    medicSummary:
      'Stabilises cardiac electrical membranes and prolongs repolarisation to stop life-threatening arrhythmias. In ALS cardiac arrest, 300mg IV/IO is given after the 3rd shock and 150mg after the 5th shock; in community patients taking oral tablets, it indicates a history of serious atrial or ventricular arrhythmias.',
  },
  amitriptyline: {
    phoneticSpelling: 'am-ee-TRIP-ti-leen',
    class: 'Tricyclic Antidepressant (TCA)',
    indications: [
      'Neuropathic pain and fibromyalgia',
      'Migraine prophylaxis',
      'Major depressive disorder (less common due to overdose toxicity)',
    ],
    medicSummary:
      'Commonly prescribed at low doses for nerve pain or migraine prevention rather than depression. It is highly cardiotoxic in overdose—always perform a 12-lead ECG if deliberate self-harm is suspected, watching for sinus tachycardia, broadened QRS complexes (>100ms), hypotension, and seizures.',
  },
  amlodipine: {
    phoneticSpelling: 'am-LO-di-peen',
    class: 'Dihydropyridine Calcium-Channel Blocker',
    indications: [
      'Essential hypertension',
      'Prophylaxis of chronic stable angina',
    ],
    medicSummary:
      'Relaxes smooth muscle in arterial walls to lower blood pressure and reduce cardiac workload. On scene, note that it frequently causes benign dependent ankle swelling (which can be mistaken for heart failure oedema) and can contribute to postural hypotension and falls in older adults.',
  },
  amoxicillin: {
    phoneticSpelling: 'a-mox-i-SIL-in',
    class: 'Broad-Spectrum Beta-Lactam Antibiotic (Penicillin)',
    indications: [
      'Community-acquired pneumonia and lower respiratory tract infections',
      'Otitis media, sinusitis, and dental infections',
      'Urinary tract infections',
    ],
    medicSummary:
      'A penicillin antibiotic that kills bacteria by disrupting their cell walls. On scene, finding a recent course tells you the patient is being treated for a suspected bacterial infection—assess carefully for worsening sepsis or an allergic reaction (rash, wheeze, or anaphylaxis).',
  },
  apixaban: {
    phoneticSpelling: 'a-PIX-a-ban',
    class: 'Direct Oral Anticoagulant (Factor Xa Inhibitor / DOAC)',
    indications: [
      'Stroke prevention in non-valvular atrial fibrillation',
      'Treatment and secondary prevention of DVT and pulmonary embolism',
    ],
    medicSummary:
      'Directly blocks clotting Factor Xa to prevent dangerous blood clots. Crucial trauma red flag: patients taking Apixaban are at high risk of occult internal or intracranial haemorrhage—under NICE and JRCALC head injury guidelines, any head trauma on a DOAC warrants hospital conveyance and CT assessment even if GCS is 15.',
  },
  aspirin: {
    phoneticSpelling: 'AS-pir-in',
    class: 'Antiplatelet (Irreversible COX-1 Inhibitor) & NSAID',
    indications: [
      'Acute coronary syndrome / suspected myocardial infarction (300mg chewed)',
      'Secondary prevention of cardiovascular and cerebrovascular events',
    ],
    medicSummary:
      'Stops platelets from clumping together to prevent arterial clot growth during a heart attack. In pre-hospital chest pain (suspected ACS), 300mg is chewed and dispersed in the mouth unless contraindicated by true allergy or active GI bleeding; in trauma, note increased bleeding tendency.',
  },
  atenolol: {
    phoneticSpelling: 'a-TEN-o-lol',
    class: 'Cardioselective Beta-1 Adrenoceptor Blocker',
    indications: [
      'Hypertension',
      'Angina pectoris',
      'Supraventricular arrhythmias',
    ],
    medicSummary:
      'Slows the heart rate and reduces blood pressure by blocking beta-1 receptors in the heart. On scene, remember that Atenolol blunts the body’s normal sympathetic tachycardia response—a patient in early hypovolaemic shock, internal bleeding, or sepsis may have a deceptively normal heart rate.',
  },
  atorvastatin: {
    phoneticSpelling: 'a-TOR-va-sta-tin',
    class: 'Statin (HMG-CoA Reductase Inhibitor)',
    indications: [
      'Primary and secondary prevention of cardiovascular disease',
      'Hypercholesterolaemia and post-ACS / post-stroke lipid management',
    ],
    medicSummary:
      'Lowers LDL cholesterol in the blood and stabilises atherosclerotic plaques in arteries. While it rarely causes acute pre-hospital issues itself, seeing it on a prescription list flags underlying cardiovascular risk factors or a history of heart attack, angina, or stroke.',
  },
  'atropine sulfate': {
    phoneticSpelling: 'AT-ro-peen SUL-fate',
    class: 'Antimuscarinic Anticholinergic',
    indications: [
      'Symptomatic bradycardia with adverse clinical features (e.g., shock, syncope, myocardial ischaemia)',
      'Organophosphate or nerve agent poisoning',
    ],
    medicSummary:
      'Blocks vagus nerve (parasympathetic) activity at the sinoatrial and AV nodes to increase heart rate. Administered as 500 micrograms IV/IO in unstable bradycardia (repeated up to 3mg maximum); do not give to heart transplant patients as their denervated heart will not respond appropriately.',
  },
  beclometasone: {
    phoneticSpelling: 'bek-lo-MET-a-zone',
    class: 'Inhaled Corticosteroid (Preventer)',
    indications: [
      'Maintenance prophylaxis of chronic asthma',
      'Severe COPD (in combination inhalers)',
    ],
    medicSummary:
      'A daily "preventer" steroid inhaler (often brown or pink) that reduces chronic airway inflammation over time. It does NOT provide rapid bronchodilation during an acute asthma attack—ensure patients are not mistakenly using their preventer instead of Salbutamol for acute relief.',
  },
  bendroflumethiazide: {
    phoneticSpelling: 'ben-dro-floo-me-THY-a-zide',
    class: 'Thiazide Diuretic',
    indications: [
      'Essential hypertension',
      'Mild peripheral oedema',
    ],
    medicSummary:
      'Lowers blood pressure by increasing salt and water excretion in the kidneys and gently relaxing blood vessels. On scene at falls or syncope, be aware that it can cause postural hypotension, dehydration, and low sodium or potassium levels (hyponatraemia/hypokalaemia), especially in elderly patients.',
  },
  benzylpenicillin: {
    phoneticSpelling: 'ben-zyl-pen-i-SIL-in',
    class: 'Beta-Lactam Antibiotic (Penicillin G)',
    indications: [
      'Suspected meningococcal septicaemia or meningitis with non-blanching rash',
    ],
    medicSummary:
      'An injectable penicillin given pre-hospital for suspected meningococcal disease when a non-blanching petechial/purpuric rash is present. Always check for a history of penicillin allergy before administration, and never delay urgent blue-light hospital transfer to reconstitute or administer it.',
  },
  bisoprolol: {
    phoneticSpelling: 'bi-SOP-ro-lol',
    class: 'Cardioselective Beta-1 Adrenoceptor Blocker',
    indications: [
      'Atrial fibrillation (rate control)',
      'Chronic heart failure (HFrEF)',
      'Angina and hypertension',
    ],
    medicSummary:
      'Slows ventricular heart rate and reduces myocardial oxygen demand. Critical on-scene pearl: Bisoprolol masks compensatory tachycardia during shock, sepsis, trauma, or hypoglycaemia, so rely on blood pressure, perfusion, respiratory rate, and lactate/skin signs rather than heart rate alone.',
  },
  'calcium chloride': {
    phoneticSpelling: 'KAL-see-um KLOR-ide',
    class: 'Electrolyte / Cardioprotective Agent',
    indications: [
      'Hyperkalaemia with toxic ECG changes or cardiac arrest',
      'Hypocalcaemia',
      'Calcium-channel blocker overdose',
    ],
    medicSummary:
      'Stabilises the cardiac cell membrane threshold against lethal arrhythmias in severe hyperkalaemia (e.g., renal failure patients with tall tented T-waves or broad QRS) without lowering potassium levels directly. Must be given through a secure, patent IV line as extravasation causes severe tissue necrosis.',
  },
  cefalexin: {
    phoneticSpelling: 'sef-a-LEX-in',
    class: 'First-Generation Cephalosporin Antibiotic',
    indications: [
      'Urinary tract infections',
      'Respiratory tract and skin/soft tissue infections',
    ],
    medicSummary:
      'A broad-spectrum antibiotic frequently prescribed for UTIs and chest or skin infections in the community. In older patients presenting with new confusion or falls while taking Cefalexin, suspect delirium secondary to an underlying UTI or systemic infection.',
  },
  chlorphenamine: {
    phoneticSpelling: 'klor-FEN-a-meen',
    class: 'Sedating Antihistamine (H1 Receptor Antagonist)',
    indications: [
      'Symptomatic relief of allergic reactions, urticaria, and pruritus',
      'Adjunct symptom relief after resuscitation in anaphylaxis',
    ],
    medicSummary:
      'Blocks histamine H1 receptors to reduce itchiness, hives, and allergic skin symptoms. In anaphylaxis, Adrenaline IM and fluid resuscitation always come first—Chlorphenamine is a secondary adjunct for skin comfort and can cause drowsiness or mild hypotension if given IV too rapidly.',
  },
  citalopram: {
    phoneticSpelling: 'si-TAL-o-pram',
    class: 'Selective Serotonin Reuptake Inhibitor (SSRI)',
    indications: [
      'Major depressive disorder',
      'Panic disorder and generalised anxiety',
    ],
    medicSummary:
      'Increases serotonin levels in the brain to treat depression and anxiety. Important ECG consideration: Citalopram causes dose-dependent QT-interval prolongation—always obtain a 12-lead ECG after an overdose, and avoid co-administering other QT-prolonging drugs such as Ondansetron if QT is prolonged.',
  },
  clarithromycin: {
    phoneticSpelling: 'kla-rith-ro-MY-sin',
    class: 'Macrolide Antibiotic',
    indications: [
      'Community-acquired pneumonia and infective COPD exacerbations',
      'Cellulitis and throat/sinus infections (especially in penicillin-allergic patients)',
    ],
    medicSummary:
      'An antibiotic frequently used for chest infections or as an alternative in penicillin allergy. Note that it can prolong the QT interval on the ECG and interacts strongly with statins and Warfarin (increasing bleeding risk).',
  },
  clindamycin: {
    phoneticSpelling: 'klin-da-MY-sin',
    class: 'Lincosamide Antibiotic',
    indications: [
      'Severe skin, soft tissue, and bone infections',
      'Penicillin-allergic severe sepsis / open fracture prophylaxis (per PGD)',
    ],
    medicSummary:
      'Inhibits bacterial protein synthesis and suppresses bacterial toxin production in severe infections. If a patient taking Clindamycin in the community develops severe watery diarrhoea, fever, and abdominal pain, consider Clostridioides difficile (C. diff) colitis.',
  },
  clopidogrel: {
    phoneticSpelling: 'klo-PID-o-grel',
    class: 'Antiplatelet (Irreversible P2Y12 Receptor Inhibitor)',
    indications: [
      'Secondary prevention after ischaemic stroke or TIA',
      'Acute coronary syndrome and post-coronary stenting (often alongside Aspirin)',
      'Peripheral arterial disease',
    ],
    medicSummary:
      'Permanently blocks platelet aggregation for the 7–10 day lifespan of the platelet to prevent arterial clots. On scene, its presence indicates prior stroke, TIA, or cardiac stenting, and significantly increases bleeding risk following trauma or falls.',
  },
  'co-amoxiclav': {
    phoneticSpelling: 'koh-a-MOX-i-klav',
    class: 'Penicillin Antibiotic + Beta-Lactamase Inhibitor (Amoxicillin & Clavulanic Acid)',
    indications: [
      'Severe respiratory, urinary, or intra-abdominal infections',
      'Animal or human bites and diabetic foot infections',
      'Open fracture prophylaxis in pre-hospital trauma (per local PGD)',
    ],
    medicSummary:
      'Combines Amoxicillin with Clavulanic Acid to overcome antibiotic-resistant bacteria. Because it is a penicillin, always screen strictly for penicillin allergy before administering or when assessing a patient with a new rash or wheeze.',
  },
  codeine: {
    phoneticSpelling: 'KOH-deen',
    class: 'Weak Opioid Analgesic',
    indications: [
      'Mild to moderate acute pain',
      'Cough suppression and acute diarrhoea (secondary uses)',
    ],
    medicSummary:
      'A prodrug converted by the liver into small amounts of Morphine for pain relief. On scene, watch for drowsiness, pinpoint pupils, respiratory depression in overdose, and severe constipation in elderly patients (which can precipitate delirium or urinary retention).',
  },
  'codeine phosphate': {
    phoneticSpelling: 'KOH-deen FOS-fate',
    class: 'Weak Opioid Analgesic',
    indications: [
      'Mild to moderate acute pain',
      'Adjunct analgesia (often combined with Paracetamol as Co-codamol)',
    ],
    medicSummary:
      'Converted in the liver to Morphine to relieve mild-to-moderate pain. Before giving further opioids on scene, check how much Codeine (or Co-codamol) the patient has already taken, and monitor for sedation, nausea, or respiratory depression.',
  },
  cyclizine: {
    phoneticSpelling: 'SY-kli-zeen',
    class: 'Antihistamine & Antimuscarinic Antiemetic',
    indications: [
      'Nausea and vomiting (including motion sickness, vertigo, and opioid-induced emesis)',
    ],
    medicSummary:
      'Acts on the vomiting centre and vestibular pathways to control nausea and dizziness. Be aware that IV Cyclizine can cause antimuscarinic tachycardia, dry mouth, confusion in older patients, and may worsen severe heart failure or acute coronary syndromes.',
  },
  dabigatran: {
    phoneticSpelling: 'da-BIG-a-tran',
    class: 'Direct Oral Anticoagulant (Direct Thrombin Inhibitor / DOAC)',
    indications: [
      'Stroke prevention in non-valvular atrial fibrillation',
      'Treatment and prevention of DVT and pulmonary embolism',
    ],
    medicSummary:
      'Directly inhibits thrombin to prevent clot formation. Major trauma and head injury red flag: patients on Dabigatran have a high risk of severe internal or intracranial bleeding and require hospital assessment after any head injury even if alert and asymptomatic.',
  },
  dexamethasone: {
    phoneticSpelling: 'dex-a-METH-a-zone',
    class: 'Potent Long-Acting Corticosteroid',
    indications: [
      ' Paediatric croup (mild, moderate, or severe)',
      'Cerebral oedema associated with brain tumours',
      'Palliative care and severe inflammatory conditions',
    ],
    medicSummary:
      'A powerful anti-inflammatory steroid with minimal fluid-retaining effect. In pre-hospital paediatric care, a single oral dose of Dexamethasone reduces upper airway subglottic swelling in croup; in community patients, note that steroids can raise blood glucose levels in diabetics.',
  },
  diazepam: {
    phoneticSpelling: 'dy-AZ-e-pam',
    class: 'Benzodiazepine',
    indications: [
      'Status epilepticus and prolonged convulsive seizures (IV/IO or PR)',
      'Severe acute muscle spasm',
      'Acute alcohol withdrawal (delirium tremens) and severe anxiety',
    ],
    medicSummary:
      'Enhances GABA activity in the brain to stop seizures, relax muscles, and sedate the central nervous system. When administering IV/IO or PR for seizures on scene, monitor airway patency, respiratory rate, and oxygen saturations closely for respiratory depression, and have bag-valve-mask support ready.',
  },
  'diclofenac sodium': {
    phoneticSpelling: 'dy-KLOF-e-nak SOH-dee-um',
    class: 'Non-Steroidal Anti-Inflammatory Drug (NSAID)',
    indications: [
      'Acute renal colic and musculoskeletal pain',
      'Inflammatory arthritis and gout',
    ],
    medicSummary:
      'Reduces pain and inflammation by blocking prostaglandin production. Contraindicated in active peptic ulceration, GI bleeding, kidney impairment, heart failure, and NSAID-sensitive asthma.',
  },
  digoxin: {
    phoneticSpelling: 'di-JOX-in',
    class: 'Cardiac Glycoside',
    indications: [
      'Rate control in atrial fibrillation or atrial flutter',
      'Advanced heart failure',
    ],
    medicSummary:
      'Slows AV node conduction to control ventricular rate in AF and increases cardiac contractility. It has a very narrow therapeutic window—in elderly patients or those with dehydration/kidney injury, watch for Digoxin toxicity (nausea, yellow/blurred vision, confusion, severe bradycardia, or heart block) and characteristic "reverse-tick" ST depression on the ECG.',
  },
  doxycycline: {
    phoneticSpelling: 'dox-ee-SY-kleen',
    class: 'Tetracycline Antibiotic',
    indications: [
      'Infective exacerbations of COPD and community-acquired pneumonia',
      'Sinusitis, skin infections, and Lyme disease',
    ],
    medicSummary:
      'A broad-spectrum antibiotic commonly included in COPD "rescue packs" alongside Prednisolone. Finding an active rescue pack on scene indicates the patient is experiencing an acute respiratory exacerbation.',
  },
  edoxaban: {
    phoneticSpelling: 'e-DOX-a-ban',
    class: 'Direct Oral Anticoagulant (Factor Xa Inhibitor / DOAC)',
    indications: [
      'Stroke prevention in non-valvular atrial fibrillation',
      'Treatment and secondary prevention of DVT and pulmonary embolism',
    ],
    medicSummary:
      'A once-daily blood thinner that blocks clotting Factor Xa. Treat any patient taking Edoxaban as high risk for life-threatening internal or intracranial bleeding following trauma or a fall—convey to hospital for head injury assessment even if GCS is 15.',
  },
  fentanyl: {
    phoneticSpelling: 'FEN-ta-nil',
    class: 'Potent Synthetic Opioid Analgesic',
    indications: [
      'Severe acute trauma or medical pain (IV, intranasal, or transmucosal)',
      'Chronic severe or palliative cancer pain (transdermal patches)',
    ],
    medicSummary:
      'Roughly 100 times more potent than Morphine with a rapid onset and shorter duration, causing less histamine release and less hypotension in trauma. In unconscious or opioid-toxic patients on scene, always expose and check the skin (chest, back, upper arms) for transdermal Fentanyl patches and remove them if respiratory depression is present.',
  },
  flucloxacillin: {
    phoneticSpelling: 'floo-klox-a-SIL-in',
    class: 'Narrow-Spectrum Beta-Lactam Antibiotic (Penicillin)',
    indications: [
      'Cellulitis, impetigo, and infected wounds',
      'Staphylococcal skin, soft tissue, and bone infections',
    ],
    medicSummary:
      'A penicillin specifically targeting skin and wound bacteria (Staphylococcus and Streptococcus). On scene, check the site of cellulitis or wound infection for spreading erythema, necrosis, or systemic red-flag sepsis signs.',
  },
  fluoxetine: {
    phoneticSpelling: 'floo-OX-e-teen',
    class: 'Selective Serotonin Reuptake Inhibitor (SSRI)',
    indications: [
      'Major depressive disorder',
      'Obsessive-compulsive disorder (OCD) and bulimia nervosa',
    ],
    medicSummary:
      'Increases serotonin availability in the central nervous system and has a very long half-life. In overdose or when combined with other serotonergic drugs (such as Tramadol), watch for Serotonin Syndrome: agitation, tremor, sweating, hyperthermia, tachycardia, and muscle rigidity/clonus.',
  },
  fluticasone: {
    phoneticSpelling: 'floo-TIK-a-zone',
    class: 'Inhaled / Intranasal Corticosteroid',
    indications: [
      'Prophylaxis of chronic asthma and COPD (often in combination inhalers)',
      'Allergic rhinitis (nasal spray)',
    ],
    medicSummary:
      'A potent anti-inflammatory steroid inhaler used daily for long-term airway control. Like Beclometasone, it will not relieve acute bronchospasm on scene—acute wheeze requires nebulised Salbutamol and Ipratropium.',
  },
  furosemide: {
    phoneticSpelling: 'fyoor-OH-se-mide',
    class: 'Loop Diuretic',
    indications: [
      'Acute cardiogenic pulmonary oedema',
      'Chronic heart failure fluid overload and peripheral oedema',
    ],
    medicSummary:
      'Promotes rapid kidney excretion of water and electrolytes (and causes early venodilation) to offload fluid from the lungs in heart failure. On scene, community use indicates underlying heart failure or fluid overload; note that high doses can cause dehydration, postural hypotension, and low potassium (hypokalaemia).',
  },
  gabapentin: {
    phoneticSpelling: 'gab-a-PEN-tin',
    class: 'Gabapentinoid (Anticonvulsant & Neuropathic Analgesic)',
    indications: [
      'Peripheral and central neuropathic pain (e.g., sciatica, diabetic neuropathy)',
      'Focal epilepsy',
    ],
    medicSummary:
      'Calms overactive nerve signalling in chronic nerve pain and epilepsy. On scene, be aware that Gabapentin significantly potentiates respiratory depression and sedation when taken alongside opioids, benzodiazepines, or alcohol.',
  },
  gliclazide: {
    phoneticSpelling: 'GLIK-la-zide',
    class: 'Sulfonylurea Antidiabetic',
    indications: [
      'Type 2 diabetes mellitus',
    ],
    medicSummary:
      'Lowers blood glucose by directly stimulating the pancreas to release more insulin regardless of meal intake. Unlike Metformin, Gliclazide is a major cause of severe, prolonged hypoglycaemia—even if a hypoglycaemic patient on Gliclazide recovers after oral glucose or IV Dextrose, they remain at high risk of recurrent hypoglycaemia and usually require medical review.',
  },
  glucagon: {
    phoneticSpelling: 'GLOO-ka-gon',
    class: 'Glycogenolytic Polypeptide Hormone',
    indications: [
      'Severe hypoglycaemia when IV access cannot be obtained and oral glucose is unsafe',
      'Refractory beta-blocker overdose (specialist use)',
    ],
    medicSummary:
      'Given as a 1mg IM injection to mobilize stored liver glycogen into glucose when a hypoglycaemic patient is unconscious/unable to swallow and IV access fails. Remember that Glucagon takes 10–15 minutes to work and will be ineffective if liver glycogen stores are depleted (e.g., chronic alcohol misuse, starvation, or recent hypoglycaemia)—feed long-acting complex carbohydrates once the patient wakes up.',
  },
  glucose: {
    phoneticSpelling: 'GLOO-kose',
    class: 'Carbohydrate / Antihypoglycaemic',
    indications: [
      'Confirmed hypoglycaemia (blood glucose < 4.0 mmol/L)',
    ],
    medicSummary:
      'Directly restores circulating blood sugar required for brain function. Administered as 40% oral glucose gel/fast-acting carbohydrate if the patient is conscious with an intact gag reflex, or as IV 10% Glucose infusion (titrated in 10g/100ml aliquots per JRCALC) in severe/unconscious hypoglycaemia.',
  },
  'glyceryl trinitrate': {
    phoneticSpelling: 'GLIS-er-il try-NY-trate',
    class: 'Organic Nitrate Vasodilator (GTN)',
    indications: [
      'Ischaemic cardiac chest pain (angina and acute coronary syndrome)',
      'Acute cardiogenic pulmonary oedema (when systolic BP > 110 mmHg)',
    ],
    medicSummary:
      'Dilates veins to reduce preload on the heart and dilates coronary arteries to improve blood flow to ischaemic heart muscle. Always check blood pressure before and after sublingual administration: contraindicated in hypotension (SBP < 90 mmHg), suspected right ventricular MI, severe aortic stenosis, or if the patient has taken a PDE-5 inhibitor (e.g., Sildenafil/Viagra, Tadalafil) within the last 24–48 hours.',
  },
  'glycopyrronium bromide': {
    phoneticSpelling: 'gly-ko-pi-ROH-nee-um BRO-mide',
    class: 'Antimuscarinic Anticholinergic',
    indications: [
      'Excessive respiratory secretions ("death rattle") in palliative end-of-life care',
      'Chronic COPD maintenance (inhaled formulation)',
    ],
    medicSummary:
      'Dries up noisy upper airway secretions in end-of-life care (as part of anticipatory "Just in Case" subcutaneous medications) without crossing the blood-brain barrier to cause central confusion. Inhaled capsules are also used daily as a long-acting bronchodilator in COPD.',
  },
  haloperidol: {
    phoneticSpelling: 'hal-oh-PER-i-dol',
    class: 'First-Generation (Typical) Antipsychotic',
    indications: [
      'Severe acute behavioural disturbance / delirium',
      'Nausea, vomiting, and agitation in palliative care',
      'Schizophrenia and acute psychosis',
    ],
    medicSummary:
      'Blocks dopamine receptors in the brain to calm severe agitation, delirium, or intractable palliative nausea. On scene, watch for acute extrapyramidal side effects (acute dystonia, muscle spasms, oculogyric crisis, or stiffness), QT prolongation on the 12-lead ECG, and rare Neuroleptic Malignant Syndrome (fever, rigidity, autonomic instability).',
  },
  hydrocortisone: {
    phoneticSpelling: 'hy-dro-KOR-ti-zone',
    class: 'Corticosteroid (Glucocorticoid & Mineralocorticoid)',
    indications: [
      'Adrenal crisis and Addison’s disease maintenance',
      'Severe or life-threatening acute asthma',
      'Refractory orbiphasic anaphylaxis follow-up management',
    ],
    medicSummary:
      'Provides essential stress-hormone replacement and suppresses severe airway or allergic inflammation. Time-critical pre-hospital pearl: patients with Addison’s disease or steroid dependence experiencing trauma, vomiting, or infection are at immediate risk of fatal hypotensive Adrenal Crisis and require urgent IM/IV Hydrocortisone (100mg) and fluid resuscitation.',
  },
  ibuprofen: {
    phoneticSpelling: 'eye-byoo-PRO-fen',
    class: 'Non-Steroidal Anti-Inflammatory Drug (NSAID)',
    indications: [
      'Mild to moderate musculoskeletal, dental, or inflammatory pain',
      'Pyrexia with discomfort',
    ],
    medicSummary:
      'Inhibits COX enzymes to reduce prostaglandin-mediated pain, fever, and swelling. Avoid administering in patients with asthma sensitive to NSAIDs, active peptic ulcer disease/GI bleeding, dehydration, renal impairment, pregnancy, or those taking anticoagulants.',
  },
  ipratropium: {
    phoneticSpelling: 'ip-ra-TRO-pee-um',
    class: 'Short-Acting Antimuscarinic Bronchodilator (SAMA)',
    indications: [
      'Acute moderate, severe, or life-threatening asthma exacerbation (alongside Salbutamol)',
      'Acute exacerbation of COPD',
    ],
    medicSummary:
      'Blocks vagal parasympathetic constriction of airway smooth muscle and reduces bronchial secretions, providing synergistic bronchodilation with Salbutamol. Given as a single 500 microgram nebulised dose in pre-hospital emergency care.',
  },
  'ipratropium bromide': {
    phoneticSpelling: 'ip-ra-TRO-pee-um BRO-mide',
    class: 'Short-Acting Antimuscarinic Bronchodilator (SAMA)',
    indications: [
      'Acute moderate, severe, or life-threatening asthma exacerbation (alongside Salbutamol)',
      'Acute exacerbation of COPD',
    ],
    medicSummary:
      'Blocks vagal parasympathetic constriction of airway smooth muscle and reduces bronchial secretions, providing synergistic bronchodilation with Salbutamol. Given as a single 500 microgram nebulised dose in pre-hospital emergency care.',
  },
  'isosorbide mononitrate': {
    phoneticSpelling: 'eye-so-SOR-bide mon-oh-NY-trate',
    class: 'Long-Acting Organic Nitrate Vasodilator',
    indications: [
      'Prophylaxis of chronic stable angina',
      'Adjunct in chronic heart failure',
    ],
    medicSummary:
      'A daily oral tablet that provides sustained venodilation and coronary vasodilation to prevent angina attacks. It does NOT treat acute chest pain on scene (GTN spray is still used for acute episodes), and can contribute to headache and postural hypotension.',
  },
  ketamine: {
    phoneticSpelling: 'KET-a-meen',
    class: 'Dissociative Anaesthetic & NMDA Receptor Antagonist',
    indications: [
      'Severe trauma or burns analgesia (sub-dissociative dosing)',
      'Procedural sedation, fracture reduction, and rapid sequence induction (RSI)',
      'Severe acute behavioural disturbance (specialist critical care)',
    ],
    medicSummary:
      'Provides potent analgesia and dissociation while uniquely preserving airway reflexes, spontaneous breathing, and sympathetic cardiovascular tone (making it ideal in hypotensive trauma or severe asthma). Can cause emergence phenomena, vivid hallucinations, tachycardia, and increased salivation.',
  },
  lactulose: {
    phoneticSpelling: 'LAK-tyoo-lose',
    class: 'Osmotic Laxative',
    indications: [
      'Chronic constipation',
      'Hepatic encephalopathy (in chronic liver disease)',
    ],
    medicSummary:
      'Draws water into the bowel to soften stools, and in liver failure traps ammonia in the gut so it doesn’t reach the brain. On scene, high-dose Lactulose in a confused patient with jaundice or ascites is a strong clue for hepatic encephalopathy.',
  },
  lansoprazole: {
    phoneticSpelling: 'lan-SO-pra-zole',
    class: 'Proton Pump Inhibitor (PPI)',
    indications: [
      'Gastro-oesophageal reflux disease (GORD) and dyspepsia',
      'Peptic ulcer disease',
      'Gastric protection in patients taking NSAIDs, Aspirin, or anticoagulants',
    ],
    medicSummary:
      'Blocks acid-producing pumps in the stomach lining. On scene, remember that severe epigastric or "indigestion" pain in a patient taking Lansoprazole can easily mimic or mask an inferior myocardial infarction—always perform a 12-lead ECG.',
  },
  levetiracetam: {
    phoneticSpelling: 'lev-e-tir-AS-e-tam',
    class: 'Antiepileptic (SV2A Synaptic Vesicle Modulator)',
    indications: [
      'Focal and generalised tonic-clonic epilepsy',
      'Second-line treatment of benzodiazepine-refractory status epilepticus',
    ],
    medicSummary:
      'Commonly known by its brand name Keppra, it is one of the most widely prescribed modern epilepsy drugs and is also used IV in refractory status epilepticus. On scene at a seizure, check medication adherence, recent dose changes, or intercurrent infection.',
  },
  levothyroxine: {
    phoneticSpelling: 'lee-vo-thy-ROX-een',
    class: 'Synthetic Thyroid Hormone (T4)',
    indications: [
      'Hypothyroidism (underactive thyroid)',
    ],
    medicSummary:
      'Replaces thyroxine hormone to maintain normal metabolic rate, heart rate, and body temperature. It has a 7-day half-life; however, prolonged non-adherence in frail or elderly patients can lead to severe hypothermia, bradycardia, lethargy, and myxoedema coma.',
  },
  lidocaine: {
    phoneticSpelling: 'LY-do-kane',
    class: 'Amide Local Anaesthetic & Class Ib Antiarrhythmic',
    indications: [
      'Local infiltration anaesthesia and IO bone marrow flush analgesia',
      'Shock-refractory VF/pVT when Amiodarone is unavailable',
    ],
    medicSummary:
      'Blocks sodium channels to numb local pain fibres (including flushing intraosseous needles in conscious patients) and suppresses ventricular arrhythmias. Watch for signs of local anaesthetic systemic toxicity (perioral tingling, tinnitus, seizures, or cardiovascular collapse) if high doses enter the bloodstream.',
  },
  lorazepam: {
    phoneticSpelling: 'lor-AZ-e-pam',
    class: 'Intermediate-Acting Benzodiazepine',
    indications: [
      'Status epilepticus (first-line IV hospital/PGD treatment)',
      'Acute severe agitation or panic attacks',
    ],
    medicSummary:
      'Potentiates GABA in the central nervous system to terminate seizures and calm acute agitation. Like Diazepam and Midazolam, monitor closely for respiratory depression, hypoxia, and hypotension, particularly if combined with alcohol or opioids.',
  },
  losartan: {
    phoneticSpelling: 'lo-SAR-tan',
    class: 'Angiotensin II Receptor Blocker (ARB)',
    indications: [
      'Hypertension',
      'Chronic heart failure and diabetic nephropathy (often used when ACE inhibitors cause a cough)',
    ],
    medicSummary:
      'Lowers blood pressure and protects the heart and kidneys by blocking angiotensin II receptors, without causing the dry cough seen with Ramipril. On scene, watch for postural hypotension and hyperkalaemia (especially in patients with renal impairment).',
  },
  macrogol: {
    phoneticSpelling: 'MAK-ro-gol',
    class: 'Osmotic Laxative (Polyethylene Glycol)',
    indications: [
      'Chronic constipation and faecal impaction (e.g., Movicol, Laxido)',
    ],
    medicSummary:
      'Retains water in the bowel to hydrate and clear impacted stool. Commonly seen on repeat prescriptions for elderly patients or those taking regular opioid analgesics.',
  },
  'magnesium sulfate': {
    phoneticSpelling: 'mag-NEE-zee-um SUL-fate',
    class: 'Electrolyte, Smooth Muscle Relaxant & Antiarrhythmic',
    indications: [
      'Eclampsia and severe pre-eclampsia seizure prophylaxis',
      'Torsades de pointes (polymorphic VT associated with long QT)',
      'Acute life-threatening asthma unresponsive to initial nebulisers',
    ],
    medicSummary:
      'Relaxes bronchial and vascular smooth muscle and stabilises cardiac and neurological membranes. In pre-hospital care, it is critical in obstetric eclamptic seizures, polymorphic VT (Torsades de pointes), and refractory life-threatening asthma.',
  },
  mebeverine: {
    phoneticSpelling: 'me-BEV-er-een',
    class: 'Antispasmodic (Direct Smooth Muscle Relaxant)',
    indications: [
      'Irritable bowel syndrome (IBS) and gastrointestinal cramping',
    ],
    medicSummary:
      'Relaxes gut smooth muscle directly without causing antimuscarinic side effects like dry mouth or blurred vision. On scene with acute abdominal pain, do not assume symptoms are simply IBS—always rule out surgical or vascular emergencies such as appendicitis, bowel obstruction, or AAA.',
  },
  metformin: {
    phoneticSpelling: 'met-FOR-min',
    class: 'Biguanide Antidiabetic',
    indications: [
      'Type 2 diabetes mellitus (first-line therapy)',
      'Polycystic ovary syndrome (PCOS)',
    ],
    medicSummary:
      'Improves insulin sensitivity and reduces glucose production by the liver. Because it does not stimulate extra insulin release, Metformin rarely causes hypoglycaemia when taken alone; however, in severe dehydration, sepsis, kidney failure, or overdose, it can cause life-threatening Lactic Acidosis (presenting with Kussmaul breathing, abdominal pain, and high lactate).',
  },
  methoxyflurane: {
    phoneticSpelling: 'meth-ox-ee-FLOOR-ane',
    class: 'Volatile Inhalational Analgesic (Penthrox)',
    indications: [
      'Self-administered relief of moderate to severe acute trauma pain in conscious adults',
    ],
    medicSummary:
      'Inhaled via the handheld green "Penthrox" whistle inhaler to provide rapid pain relief within 6–10 breaths, allowing patients to self-titrate during extrication or splinting. Contraindicated in patients with reduced consciousness, head injury, renal impairment, liver disease, or a personal/family history of malignant hyperthermia.',
  },
  metoclopramide: {
    phoneticSpelling: 'met-oh-KLOP-ra-mide',
    class: 'Dopamine D2 Antagonist & Prokinetic Antiemetic',
    indications: [
      'Nausea and vomiting (including migraine-associated nausea)',
    ],
    medicSummary:
      'Blocks dopamine receptors in the brain’s chemoreceptor trigger zone and speeds up gastric emptying. Important pre-hospital warning: Metoclopramide can trigger acute dystonic reactions (painful neck/jaw spasms or oculogyric crisis where the eyes roll upwards), particularly in children and young adults under 20, and is contraindicated in bowel obstruction or Parkinson’s disease.',
  },
  metoprolol: {
    phoneticSpelling: 'me-TOP-ro-lol',
    class: 'Cardioselective Beta-1 Adrenoceptor Blocker',
    indications: [
      'Hypertension and angina pectoris',
      'Supraventricular and ventricular arrhythmias',
      'Migraine prophylaxis and heart failure',
    ],
    medicSummary:
      'Blocks beta-1 receptors in the heart to slow heart rate and reduce blood pressure. Like Bisoprolol and Atenolol, it blunts compensatory tachycardia—patients in hypovolaemic or septic shock may not mount a high heart rate on scene.',
  },
  midazolam: {
    phoneticSpelling: 'mi-DAZ-o-lam',
    class: 'Short-Acting Water-Soluble Benzodiazepine',
    indications: [
      'Status epilepticus and prolonged convulsive seizures (buccal, intranasal, IM, or IV)',
      'Acute behavioural disturbance and procedural sedation (specialist/PGD)',
      'End-of-life agitation and distress (subcutaneous)',
    ],
    medicSummary:
      'Rapidly crosses into the brain to terminate seizures and produce sedation and amnesia. Because of its rapid onset, monitor airway patency, respiratory effort, and SpO2 continuously after administration and be prepared to support ventilation.',
  },
  misoprostol: {
    phoneticSpelling: 'my-so-PROS-tol',
    class: 'Synthetic Prostaglandin E1 Analogue (Uterotonic & Mucosal Protectant)',
    indications: [
      'Postpartum haemorrhage (PPH) due to uterine atony (when Oxytocin/Syntometrine is unavailable or as an adjunct)',
      'NSAID-induced gastric ulcer prophylaxis',
    ],
    medicSummary:
      'Stimulates strong uterine smooth muscle contractions to compress bleeding vessels after childbirth in postpartum haemorrhage. Commonly causes shivering, transient pyrexia, diarrhoea, and abdominal cramping after administration.',
  },
  montelukast: {
    phoneticSpelling: 'mon-te-LOO-kast',
    class: 'Leukotriene Receptor Antagonist (LTRA)',
    indications: [
      'Add-on prophylaxis of chronic asthma (especially exercise- or allergy-induced)',
      'Seasonal allergic rhinitis',
    ],
    medicSummary:
      'An oral evening tablet that blocks inflammatory leukotrienes in the airways to help prevent asthma flare-ups. It is strictly a maintenance preventer tablet and has no role in relieving an acute asthma attack on scene.',
  },
  morphine: {
    phoneticSpelling: 'MOR-feen',
    class: 'Strong Opioid Analgesic',
    indications: [
      'Severe acute pain (trauma, burns, surgical, or myocardial infarction)',
    ],
    medicSummary:
      'Binds to central mu-opioid receptors to relieve severe pain and reduce sympathetic distress. Titrate IV slowly while monitoring respiratory rate, sedation score, pupils, and blood pressure—Morphine causes histamine release and venodilation that can precipitate hypotension in hypovolaemic patients, and is reversed with Naloxone if respiratory depression occurs.',
  },
  'morphine sulfate': {
    phoneticSpelling: 'MOR-feen SUL-fate',
    class: 'Strong Opioid Analgesic',
    indications: [
      'Severe acute pain (trauma, burns, or acute coronary syndrome)',
      'Breathlessness and pain in palliative care (oral Oramorph or subcutaneous)',
    ],
    medicSummary:
      'The standard JRCALC strong opioid for severe acute pain, titrated IV/IM/PO to patient response. Watch closely for respiratory depression, pinpoint pupils, nausea, and histamine-induced hypotension or itchiness; keep Naloxone readily available.',
  },
  naloxone: {
    phoneticSpelling: 'na-LOX-one',
    class: 'Competitive Opioid Receptor Antagonist',
    indications: [
      'Opioid-induced respiratory depression and life-threatening opioid overdose',
    ],
    medicSummary:
      'Rapidly displaces opioids from brain receptors to restore spontaneous breathing and airway reflexes. Titrate to restore adequate respiratory rate and oxygenation rather than full agitated awakening, and remember that Naloxone wears off in 30–60 minutes—much faster than long-acting opioids like Methadone, Oxycodone, or oral Morphine—creating a high risk of re-sedation.',
  },
  naproxen: {
    phoneticSpelling: 'na-PROX-en',
    class: 'Non-Steroidal Anti-Inflammatory Drug (NSAID)',
    indications: [
      'Musculoskeletal pain, sprains, sciatica, and arthritis',
      'Acute gout and dysmenorrhoea',
    ],
    medicSummary:
      'A longer-acting anti-inflammatory painkiller often prescribed alongside a PPI like Omeprazole or Lansoprazole to protect the stomach. On scene, note that NSAIDs can cause upper GI bleeding (coffee-ground vomit or melaena), worsen kidney function, and trigger bronchospasm in aspirin-sensitive asthmatics.',
  },
  nitrofurantoin: {
    phoneticSpelling: 'ny-tro-fyoor-AN-toyn',
    class: 'Nitrofuran Urinary Antibiotic',
    indications: [
      'Uncomplicated lower urinary tract infections (cystitis)',
    ],
    medicSummary:
      'Concentrates specifically in the urine to treat bladder infections. Seeing Nitrofurantoin on a patient’s medication table immediately points to a recent or active UTI—a frequent trigger for acute delirium, confusion, falls, or urosepsis in older adults.',
  },
  'nitrous oxide': {
    phoneticSpelling: 'NY-trus OX-ide',
    class: 'Inhalational Analgesic Gas (Entonox: 50% Nitrous Oxide / 50% Oxygen)',
    indications: [
      'Moderate to severe acute trauma, musculoskeletal, or obstetric labour pain',
    ],
    medicSummary:
      'Self-administered via a demand valve to provide rapid-onset analgesia that wears off within minutes of stopping inhalation. Strictly contraindicated in any condition where trapped gas could dangerously expand: suspected pneumothorax, decompression sickness, penetrating chest trauma, bowel obstruction, severe head injury with impaired consciousness, or recent intraocular gas surgery.',
  },
  omeprazole: {
    phoneticSpelling: 'oh-MEP-ra-zole',
    class: 'Proton Pump Inhibitor (PPI)',
    indications: [
      'Gastro-oesophageal reflux disease (GORD) and dyspepsia',
      'Peptic ulcer disease and GI bleed prophylaxis (with antiplatelets/NSAIDs)',
    ],
    medicSummary:
      'Reduces stomach acid secretion and is one of the most commonly prescribed drugs in the UK, often given to protect the stomach in patients taking Aspirin, Clopidogrel, DOACs, or NSAIDs. Never dismiss central or epigastric chest pain as simple reflux just because a patient takes Omeprazole.',
  },
  ondansetron: {
    phoneticSpelling: 'on-DAN-se-tron',
    class: '5-HT3 Serotonin Receptor Antagonist (Antiemetic)',
    indications: [
      'Prevention and treatment of acute nausea and vomiting',
      'Opioid-induced or trauma/motion-induced emesis',
    ],
    medicSummary:
      'Blocks serotonin 5-HT3 receptors in the gut and brainstem to stop nausea and vomiting without causing sedation or extrapyramidal movement side effects. Administer IV slowly over 2–3 minutes (or IM/orally), and avoid in patients with congenital or drug-induced long QT syndrome.',
  },
  oxycodone: {
    phoneticSpelling: 'ox-ee-KOH-done',
    class: 'Strong Semi-Synthetic Opioid Analgesic',
    indications: [
      'Severe acute, post-operative, or cancer-related pain (e.g., Shortec immediate-release, Longtec modified-release)',
    ],
    medicSummary:
      'A potent oral or injectable opioid approximately 1.5 to 2 times stronger than oral Morphine. Frequently prescribed in palliative care or severe chronic pain—watch for opioid toxicity (pinpoint pupils,bradypnoea, coma) especially if renal function declines.',
  },
  oxygen: {
    phoneticSpelling: 'OX-i-jen',
    class: 'Medical Gas',
    indications: [
      'Hypoxaemia (target SpO2 94–98% in most acutely ill patients)',
      'Target SpO2 88–92% in patients at risk of hypercapnic respiratory failure (e.g., chronic COPD)',
      'Critical illness, cardiac arrest, major trauma, carbon monoxide poisoning, and anaphylaxis (15 L/min reservoir mask)',
    ],
    medicSummary:
      'Prescribed and titrated to target oxygen saturation ranges rather than given indiscriminately. In acute coronary syndrome or stroke without hypoxaemia, routine high-flow oxygen is not indicated; in COPD retainers, over-oxygenation above 92% can drive dangerous hypercapnic respiratory acidosis.',
  },
  paracetamol: {
    phoneticSpelling: 'pa-ra-SEE-ta-mol',
    class: 'Non-Opioid Analgesic & Antipyretic',
    indications: [
      'Mild to moderate pain (oral) and moderate to severe pain (IV or adjunct with opioids)',
      'Pyrexia with discomfort',
    ],
    medicSummary:
      'First-line painkiller and fever reducer across UK practice. Before administering on scene, always ask specifically when the last dose was taken, the total 24-hour cumulative dose (max 4g in standard adults; reduced in low body weight <50kg), and whether the patient has taken combination products like Co-codamol, Co-dydramol, or Lemsip to avoid accidental liver-toxic overdose.',
  },
  penthrox: {
    phoneticSpelling: 'PEN-throx',
    class: 'Volatile Inhalational Analgesic (Methoxyflurane)',
    indications: [
      'Emergency relief of moderate to severe trauma pain in conscious adult patients',
    ],
    medicSummary:
      'Brand name for Methoxyflurane delivered via the handheld green whistle inhaler, providing rapid analgesia within 6–10 breaths. Ensure the activated carbon chamber is attached to scavenge exhaled vapour in enclosed spaces like the back of an ambulance, and avoid in renal/hepatic impairment or reduced consciousness.',
  },
  pivmecillinam: {
    phoneticSpelling: 'piv-me-SIL-i-nam',
    class: 'Penicillin Antibiotic (Amidino-Penicillin)',
    indications: [
      'Acute uncomplicated urinary tract infections (cystitis)',
    ],
    medicSummary:
      'An oral penicillin antibiotic used specifically for urinary tract infections. Important safety check: although its name doesn’t start with "amox-" or "fluclox-", Pivmecillinam IS a penicillin and is strictly contraindicated in patients with a penicillin allergy.',
  },
  prednisolone: {
    phoneticSpelling: 'pred-NIS-o-lone',
    class: 'Oral Corticosteroid (Glucocorticoid)',
    indications: [
      'Acute exacerbations of asthma and COPD',
      'Polymyalgia rheumatica, inflammatory bowel disease, and autoimmune conditions',
    ],
    medicSummary:
      'Suppresses airway and systemic inflammation over several hours. On scene, note that Prednisolone causes significant hyperglycaemia in diabetic patients, can mask fever in infection, and patients taking long-term daily steroids (>3–4 weeks) are at risk of adrenal crisis if stressed by severe illness or trauma.',
  },
  pregabalin: {
    phoneticSpelling: 'pre-GAB-a-lin',
    class: 'Gabapentinoid (Neuropathic Analgesic, Anticonvulsant & Anxiolytic)',
    indications: [
      'Peripheral and central neuropathic pain',
      'Generalised anxiety disorder',
      'Adjunct in focal epilepsy',
    ],
    medicSummary:
      'Reduces abnormal excitatory neurotransmitter release in nerve pain and anxiety. High-risk interaction on scene: Pregabalin strongly amplifies central nervous system and respiratory depression when combined with opioids, benzodiazepines, or alcohol.',
  },
  prochlorperazine: {
    phoneticSpelling: 'pro-klor-PER-a-zeen',
    class: 'Phenothiazine Dopamine Antagonist (Antiemetic & Vestibular Sedative)',
    indications: [
      'Vertigo, labyrinthitis, and Ménière’s disease',
      'Nausea and vomiting (oral or buccal Stemetil tablets)',
    ],
    medicSummary:
      'Commonly prescribed (often as buccal tablets placed between the upper lip and gum) for severe dizziness, vertigo, and nausea. Can cause drowsiness, postural hypotension, and acute dystonic movement reactions in younger patients.',
  },
  propranolol: {
    phoneticSpelling: 'pro-PRAN-o-lol',
    class: 'Non-Selective Beta-Adrenoceptor Blocker',
    indications: [
      'Physical symptoms of anxiety and situational panic',
      'Migraine prophylaxis and essential tremor',
      'Portal hypertension, thyrotoxicosis, and arrhythmias',
    ],
    medicSummary:
      'Blocks both beta-1 (heart) and beta-2 (airway) receptors. Two critical pre-hospital warnings: first, it can trigger severe bronchospasm in asthmatics; second, Propranolol overdose is uniquely lethal because it also blocks cardiac sodium channels, rapidly causing refractory bradycardia, broad-complex QRS arrhythmias, seizures, and cardiac arrest.',
  },
  quetiapine: {
    phoneticSpelling: 'kwe-TY-a-peen',
    class: 'Second-Generation (Atypical) Antipsychotic',
    indications: [
      'Schizophrenia and bipolar disorder',
      'Adjunct in major depression and low-dose sedation',
    ],
    medicSummary:
      'Acts on dopamine, serotonin, and histamine receptors to stabilise mood and treat psychosis. On scene, it frequently causes marked sedation, sinus tachycardia, postural hypotension, and QT-interval prolongation on the 12-lead ECG.',
  },
  ramipril: {
    phoneticSpelling: 'ra-MI-pril',
    class: 'ACE Inhibitor',
    indications: [
      'Essential hypertension',
      'Chronic heart failure and post-myocardial infarction remodelling prevention',
      'Diabetic kidney protection',
    ],
    medicSummary:
      'Relaxes blood vessels and reduces cardiac afterload by blocking the conversion of angiotensin I to angiotensin II. Key pre-hospital pearl: Ramipril can cause sudden bradykinin-mediated angioedema (severe lip, tongue, or upper airway swelling without itchiness or hives) even after years of trouble-free use, as well as a persistent dry cough and postural hypotension.',
  },
  rivaroxaban: {
    phoneticSpelling: 'riv-a-ROX-a-ban',
    class: 'Direct Oral Anticoagulant (Factor Xa Inhibitor / DOAC)',
    indications: [
      'Stroke prevention in non-valvular atrial fibrillation',
      'Treatment and prevention of DVT and pulmonary embolism',
    ],
    medicSummary:
      'A once-daily oral anticoagulant that inhibits clotting Factor Xa. Major trauma and falls red flag: patients on Rivaroxaban cannot form normal clots easily and require hospital assessment after any head injury (even with GCS 15 and no visible wound) to rule out intracranial haemorrhage.',
  },
  salbutamol: {
    phoneticSpelling: 'sal-BYOO-ta-mol',
    class: 'Short-Acting Beta-2 Adrenoceptor Agonist (SABA)',
    indications: [
      'Acute asthma and COPD exacerbations (reliever inhaler or nebuliser)',
      'Bronchospasm in anaphylaxis or smoke inhalation',
      'Adjunct in severe hyperkalaemia (drives potassium into cells)',
    ],
    medicSummary:
      'Stimulates beta-2 receptors in the lungs to rapidly relax bronchial smooth muscle and open constricted airways. Expect dose-related sinus tachycardia and fine muscle tremor after nebulisation; in COPD patients, limit oxygen-driven nebulisers to 6 minutes (or use air-driven with nasal cannulae oxygen) to prevent hypercapnic respiratory failure.',
  },
  senna: {
    phoneticSpelling: 'SEN-a',
    class: 'Stimulant Laxative',
    indications: [
      'Constipation (especially opioid-induced constipation)',
    ],
    medicSummary:
      'Stimulates bowel wall contractions (peristalsis) within 8–12 hours to relieve constipation. Commonly co-prescribed alongside codeine or morphine so patients do not become impacted.',
  },
  sertraline: {
    phoneticSpelling: 'SER-tra-leen',
    class: 'Selective Serotonin Reuptake Inhibitor (SSRI)',
    indications: [
      'Major depressive disorder and generalised anxiety disorder',
      'Post-traumatic stress disorder (PTSD) and OCD',
    ],
    medicSummary:
      'The most widely prescribed antidepressant in the UK, preferred because it is safer for the heart than Citalopram or Amitriptyline. On scene, watch for Serotonin Syndrome (agitation, sweating, tremor, tachycardia, hyperthermia) after overdose or if combined with Tramadol.',
  },
  simvastatin: {
    phoneticSpelling: 'sim-va-STA-tin',
    class: 'Statin (HMG-CoA Reductase Inhibitor)',
    indications: [
      'Primary and secondary prevention of cardiovascular disease',
      'Hypercholesterolaemia',
    ],
    medicSummary:
      'Taken in the evening to lower blood cholesterol and reduce the risk of heart attacks and strokes. Its presence on a patient’s repeat prescription indicates established cardiovascular risk factors or prior vascular disease.',
  },
  sitagliptin: {
    phoneticSpelling: 'sit-a-GLIP-tin',
    class: 'DPP-4 Inhibitor (Gliptin Antidiabetic)',
    indications: [
      'Type 2 diabetes mellitus',
    ],
    medicSummary:
      'Enhances the body’s own glucose-dependent insulin release after meals. It rarely causes hypoglycaemia on its own unless taken alongside Gliclazide or Insulin; however, rare acute pancreatitis is a known serious side effect if a patient presents with severe epigastric pain radiating to the back.',
  },
  'sodium chloride': {
    phoneticSpelling: 'SOH-dee-um KLOR-ide',
    class: 'Isotonic Crystalloid Intravenous Fluid (0.9% Normal Saline)',
    indications: [
      'Hypovolaemic, septic, or anaphylactic shock fluid resuscitation',
      'IV/IO line flushing and medication dilution',
    ],
    medicSummary:
      'Expands intravascular circulating volume to support blood pressure and organ perfusion. In trauma haemorrhage, titrate cautiously (permissive hypotension, radial pulse / SBP 80–90 mmHg unless traumatic brain injury is present) to avoid diluting clotting factors and dislodging fragile clots.',
  },
  'sodium valproate': {
    phoneticSpelling: 'SOH-dee-um VAL-pro-ate',
    class: 'Broad-Spectrum Antiepileptic & Mood Stabiliser',
    indications: [
      'Generalised and focal epilepsy',
      'Bipolar disorder and migraine prophylaxis',
    ],
    medicSummary:
      'Stabilises electrical activity in the brain by increasing GABA levels and blocking sodium channels. Strictly teratogenic in pregnancy; in overdose it can cause CNS depression, cerebral oedema, hyperammonaemia, and metabolic acidosis.',
  },
  syntometrine: {
    phoneticSpelling: 'sin-TOM-e-treen',
    class: 'Combined Uterotonic (Ergometrine Maleate 500mcg & Oxytocin 5 IU)',
    indications: [
      'Prevention and treatment of postpartum haemorrhage (PPH) after delivery of the baby',
    ],
    medicSummary:
      'Given IM in obstetric emergencies to combine the rapid rhythmic contractions of Oxytocin with the sustained uterine contraction of Ergometrine to arrest severe bleeding after birth. Before giving, always palpate the abdomen to confirm a second undiagnosed twin is not still in utero, and avoid in severe hypertension or pre-eclampsia/eclampsia as Ergometrine causes vasoconstriction.',
  },
  ticagrelor: {
    phoneticSpelling: 'ty-KAG-re-lor',
    class: 'Reversible P2Y12 Receptor Antagonist Antiplatelet',
    indications: [
      'Acute coronary syndrome (ACS) and post-coronary stenting (as Dual Antiplatelet Therapy with Aspirin)',
    ],
    medicSummary:
      'A potent antiplatelet typically prescribed for 12 months after a heart attack or coronary stent insertion. On scene, it signals a recent myocardial infarction/PCI and carries a high risk of bleeding in trauma; notably, Ticagrelor can also cause a benign sensation of mild shortness of breath as a drug side effect.',
  },
  tiotropium: {
    phoneticSpelling: 'ty-oh-TRO-pee-um',
    class: 'Long-Acting Antimuscarinic Bronchodilator (LAMA)',
    indications: [
      'Maintenance bronchodilation in chronic COPD and severe asthma',
    ],
    medicSummary:
      'A once-daily maintenance inhaler (often Spiriva or Braltus) that keeps airways open over 24 hours in COPD. Seeing Tiotropium on scene confirms a diagnosis of chronic airway disease (usually COPD), which should guide your target oxygen saturations (88–92% until blood gases are known).',
  },
  tramadol: {
    phoneticSpelling: 'TRAM-a-dol',
    class: 'Weak Opioid & Serotonin/Noradrenaline Reuptake Inhibitor Analgesic',
    indications: [
      'Moderate to severe acute or chronic pain',
    ],
    medicSummary:
      'Acts both as an opioid agonist and by inhibiting serotonin and noradrenaline reuptake. Critical pre-hospital interactions: unlike standard opioids, Tramadol lowers the seizure threshold (can trigger convulsions) and can precipitate Serotonin Syndrome if the patient also takes SSRIs (like Sertraline, Citalopram, or Fluoxetine).',
  },
  'tranexamic acid': {
    phoneticSpelling: 'tran-ex-AM-ik AS-id',
    class: 'Antifibrinolytic Haemostatic Agent (TXA)',
    indications: [
      'Major trauma with actual or suspected severe internal or external haemorrhage',
      'Significant postpartum haemorrhage (PPH)',
      'Moderate to severe traumatic brain injury (GCS 12 or less within 3 hours)',
    ],
    medicSummary:
      'Prevents premature breakdown of blood clots by blocking plasminogen activation, significantly reducing mortality from bleeding. Time-critical: 1g IV/IO infused over 10 minutes must be given as early as possible and strictly within 3 hours of injury or PPH onset.',
  },
  trimethoprim: {
    phoneticSpelling: 'try-METH-o-prim',
    class: 'Folate Antagonist Antibiotic',
    indications: [
      'Acute urinary tract infections (cystitis)',
      'Respiratory tract infections',
    ],
    medicSummary:
      'Inhibits bacterial folic acid synthesis to treat UTIs. In elderly patients, finding Trimethoprim alerts you to a suspected UTI (a common cause of acute delirium or falls) and note that it can raise serum potassium levels when combined with Ramipril or Spironolactone.',
  },
  warfarin: {
    phoneticSpelling: 'WOR-far-in',
    class: 'Vitamin K Antagonist Oral Anticoagulant',
    indications: [
      'Mechanical heart valves and rheumatic mitral stenosis',
      'Atrial fibrillation stroke prevention',
      'Treatment and prophylaxis of DVT and pulmonary embolism',
    ],
    medicSummary:
      'Inhibits Vitamin K-dependent clotting factors and requires regular INR blood monitoring (yellow anticoagulant book). High-risk trauma red flag: any patient on Warfarin sustaining a head injury or fall requires hospital assessment and CT imaging even if GCS is 15, as intracranial bleeding can develop insidiously.',
  },
  zopiclone: {
    phoneticSpelling: 'ZOP-i-klone',
    class: 'Non-Benzodiazepine Hypnotic ("Z-Drug")',
    indications: [
      'Short-term treatment of severe insomnia',
    ],
    medicSummary:
      'Enhances GABA activity to induce sleep and commonly leaves a metallic taste in the mouth. On scene at night-time falls in older adults, Zopiclone is a frequent culprit due to ataxia, drowsiness, confusion, and unsteadiness.',
  },
};

/**
 * Looks up pre-generated clinical details for a drug by matching either the exact
 * drug name or its base UK generic name (e.g. "Bisoprolol fumarate" -> "bisoprolol",
 * "Morphine sulfate 10mg/1ml..." -> "morphine sulfate" / "morphine").
 */
export function findPregeneratedClinicalDetails(
  drugName: string
): GeminiClinicalDetails | undefined {
  const normalized = drugName.trim().toLowerCase();

  // 1. Direct exact key match
  if (PREGENERATED_CLINICAL_DETAILS[normalized]) {
    return PREGENERATED_CLINICAL_DETAILS[normalized];
  }

  // 2. Match longest prefix / word-boundary key (e.g., "Amiodarone hydrochloride" -> "amiodarone")
  const keys = Object.keys(PREGENERATED_CLINICAL_DETAILS).sort(
    (a, b) => b.length - a.length
  );

  for (const key of keys) {
    if (
      normalized === key ||
      normalized.startsWith(`${key} `) ||
      normalized.startsWith(`${key} (`) ||
      normalized.includes(`(${key})`)
    ) {
      return PREGENERATED_CLINICAL_DETAILS[key];
    }
  }

  return undefined;
}
