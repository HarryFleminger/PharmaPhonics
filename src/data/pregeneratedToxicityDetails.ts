import { GeminiToxicityDetails } from '../types/medication';

/**
 * Pre-generated UK Paramedic (JRCALC) & Toxbase-aligned overdose profiles for all 101
 * medications across the Quick Categories. Stored directly in the bundle so selecting
 * any Quick Category drug in Toxicity Mode uses 0 Gemini API tokens.
 */
export const PREGENERATED_TOXICITY_DETAILS: Record<string, GeminiToxicityDetails> = {
  adenosine: {
    toxicThreshold:
      'Iatrogenic IV bolus >18 mg single dose or rapid repeated boluses (ultra-short half-life <10 seconds).',
    overdoseEffects:
      'Transient profound bradycardia, prolonged sinus pause or transient asystole, acute hypotension, facial flushing, severe chest tightness, and acute bronchospasm (especially in asthmatics). Because its half-life is under 10 seconds, effects typically resolve rapidly unless decompensated arrhythmia is triggered.',
  },
  adrenaline: {
    toxicThreshold:
      '>10 mcg/kg IV (or inadvertent IV administration of a >500 micrograms IM anaphylaxis dose) in a non-arrested patient.',
    overdoseEffects:
      'Sudden severe hypertension (hypertensive crisis), extreme sinus tachycardia, ventricular ectopics, ventricular tachycardia or fibrillation (VT/VF), myocardial ischaemia ("Takotsubo" stress cardiomyopathy), pallor, tremor, severe headache, and acute pulmonary oedema.',
  },
  alendronic: {
    toxicThreshold:
      'Any acute ingestion above the prescribed weekly 70 mg dose (or >1–2 mg/kg).',
    overdoseEffects:
      'Severe upper gastrointestinal mucosal irritation and chemical oesophagitis: retrosternal burning chest pain, dysphagia, odynophagia, haematemesis, and abdominal pain. Large overdoses can also cause symptomatic hypocalcaemia (perioral tingling, muscle cramps, carpopedal spasm, and QTc prolongation).',
  },
  'alendronic acid': {
    toxicThreshold:
      'Any acute ingestion above the prescribed weekly 70 mg dose (or >1–2 mg/kg).',
    overdoseEffects:
      'Severe upper gastrointestinal mucosal irritation and chemical oesophagitis: retrosternal burning chest pain, dysphagia, odynophagia, haematemesis, and abdominal pain. Large overdoses can also cause symptomatic hypocalcaemia (perioral tingling, muscle cramps, carpopedal spasm, and QTc prolongation).',
  },
  alteplase: {
    toxicThreshold:
      'Doses exceeding the weight-adjusted maximum (>0.9 mg/kg or >90 mg total in acute ischaemic stroke; >100 mg in PE/STEMI).',
    overdoseEffects:
      'Systemic fibrinolysis and severe life-threatening haemorrhage. Presents clinically with sudden neurological deterioration (intracranial haemorrhage: headache, vomiting, unilateral weakness, falling GCS, Cushing’s response with hypertension and bradycardia) or haemodynamic shock from gastrointestinal or internal bleeding (tachycardia, hypotension, pallor).',
  },
  amiodarone: {
    toxicThreshold:
      'Acute oral ingestion >2–4 g in adults, or rapid IV bolus exceeding 300 mg in a perfusing patient.',
    overdoseEffects:
      'Profound sinus bradycardia, atrioventricular (AV) heart block, marked QTc interval prolongation on 12-lead ECG, polymorphic ventricular tachycardia (Torsades de Pointes), and refractory vasodilatory hypotension (especially with rapid IV administration). Oral overdose effects may be delayed for 24–72 hours due to slow absorption.',
  },
  amitriptyline: {
    toxicThreshold:
      '>5 mg/kg causes significant toxicity; >10 mg/kg (or >750–1,000 mg in an adult) is potentially life-threatening.',
    overdoseEffects:
      'Rapid onset (within 1–2 hours) of anticholinergic and sodium-channel blockade: sinus tachycardia, dry hot skin, dilated pupils, urinary retention, rapidly falling GCS/coma, generalized seizures, hypotension, and broad-complex QRS widening (>100–120 ms) progressing to ventricular arrhythmias (VT/VF).',
  },
  amlodipine: {
    toxicThreshold:
      '>0.3 mg/kg (or >20–30 mg in an adult) causes significant vasodilatory hypotension; >50–100 mg can cause refractory shock.',
    overdoseEffects:
      'Profound peripheral vasodilation causing severe, refractory hypotension with a compensatory reflex sinus tachycardia (or bradycardia in massive overdose), warm flushed skin initially progressing to cold hypoperfusion, dizziness, syncope, metabolic (lactic) acidosis, hyperglycaemia, and non-cardiogenic pulmonary oedema. Onset may be delayed up to 6–12 hours.',
  },
  amoxicillin: {
    toxicThreshold:
      'Generally low acute toxicity; ingestions >250 mg/kg (or >10–15 g in adults) may cause significant GI and renal effects.',
    overdoseEffects:
      'Primarily gastrointestinal upset (nausea, vomiting, abdominal cramps, and watery diarrhoea). Massive overdoses—particularly in dehydrated patients—can cause amoxicillin crystalluria, haematuria, oliguria, and acute kidney injury; high CNS levels in renal failure can rarely provoke myoclonus or seizures.',
  },
  apixaban: {
    toxicThreshold:
      'Any acute overdose (>10–20 mg single ingestion) elevates major bleeding risk for 24–48 hours.',
    overdoseEffects:
      'Often asymptomatic initially until spontaneous or trauma-provoked haemorrhage occurs: epistaxis, gingival bleeding, haematuria, haematemesis, melaena, or occult internal/intracranial bleeding. Vital sign changes reflect haemorrhagic hypovolaemia (compensatory tachycardia, narrowing pulse pressure, and late hypotension).',
  },
  aspirin: {
    toxicThreshold:
      '>125 mg/kg causes mild-to-moderate salicylate toxicity; >250 mg/kg causes severe toxicity; >500 mg/kg is potentially lethal.',
    overdoseEffects:
      'Classic salicylate toxidrome: tinnitus ("ringing in the ears"), muffled hearing, nausea, vomiting, profuse sweating, hyperpyrexia, and tachypnoea/hyperventilation (Kussmaul breathing). Creates a mixed respiratory alkalosis and high-anion-gap metabolic acidosis; confusion, delirium, seizures, and coma indicate severe CNS salicylate penetration.',
  },
  atenolol: {
    toxicThreshold:
      '>200–300 mg in a non-tolerant adult (or >4–5 mg/kg).',
    overdoseEffects:
      'Marked sinus bradycardia, 1st/2nd/3rd-degree AV heart block, hypotension, cardiogenic shock, lethargy, dizziness, syncope, and bronchospasm (at higher doses when beta-1 selectivity is lost). Can also mask the adrenergic warning signs of concurrent hypoglycaemia.',
  },
  atorvastatin: {
    toxicThreshold:
      'Low acute toxicity; single ingestions >400–800 mg rarely cause life-threatening acute systemic effects.',
    overdoseEffects:
      'Usually mild gastrointestinal symptoms (nausea, dyspepsia, abdominal discomfort, diarrhoea) and headache. Very large ingestions carry a delayed risk of acute myopathy, severe muscle pain/weakness, dark "tea-coloured" urine (myoglobinuria), and rhabdomyolysis.',
  },
  atropine: {
    toxicThreshold:
      '>50–100 mcg/kg (>3 mg in adults) produces marked systemic anticholinergic toxicity.',
    overdoseEffects:
      'Classic central and peripheral antimuscarinic syndrome ("blind as a bat, mad as a hatter, red as a beet, hot as a hare, dry as a bone"): marked sinus tachycardia, hyperthermia, dry flushed skin, fixed dilated pupils (mydriasis), blurred vision, urinary retention, absent bowel sounds, agitation, visual hallucinations, delirium, and seizures.',
  },
  'atropine sulfate': {
    toxicThreshold:
      '>50–100 mcg/kg (>3 mg in adults) produces marked systemic anticholinergic toxicity.',
    overdoseEffects:
      'Classic central and peripheral antimuscarinic syndrome ("blind as a bat, mad as a hatter, red as a beet, hot as a hare, dry as a bone"): marked sinus tachycardia, hyperthermia, dry flushed skin, fixed dilated pupils (mydriasis), blurred vision, urinary retention, absent bowel sounds, agitation, visual hallucinations, delirium, and seizures.',
  },
  beclometasone: {
    toxicThreshold:
      'Extremely low acute toxicity via inhalation; acute inhalation of an entire inhaler (>20–40 mg) rarely causes systemic crisis.',
    overdoseEffects:
      'Acute overdose of inhaled puffs causes throat irritation, hoarseness, cough, and mild nausea. Only chronic excessive supratherapeutic use leads to systemic corticosteroid effects (adrenal suppression, Cushingoid features, hyperglycaemia, and hypertension).',
  },
  bendroflumethiazide: {
    toxicThreshold:
      '>10–20 mg in adults (4–8 times the standard 2.5 mg daily dose) causes significant diuresis and electrolyte depletion.',
    overdoseEffects:
      'Profuse polyuria leading to dehydration, volume depletion, postural hypotension, reflex tachycardia, dizziness, and syncope. Rapid electrolyte shifts—specifically hypokalaemia, hyponatraemia, and hypomagnesaemia—can cause muscle weakness, cramps, lethargy, confusion, and cardiac arrhythmias (U waves, flattened T waves, ectopics).',
  },
  benzylpenicillin: {
    toxicThreshold:
      'Massive IV doses (>12–20 g/day, or lower in severe renal impairment) can cause neurotoxicity.',
    overdoseEffects:
      'Gastrointestinal nausea and vomiting, electrolyte disturbances from the sodium/potassium salt load, and penicillin encephalopathy (hyperreflexia, myoclonic twitching, agitation, confusion, hallucinations, and generalised tonic-clonic status epilepticus).',
  },
  bisoprolol: {
    toxicThreshold:
      '>20–30 mg in a non-tolerant adult (or >0.4 mg/kg).',
    overdoseEffects:
      'Profound sinus bradycardia, junctional escape rhythms, high-grade AV block, hypotension, cold extremities, dizziness, and syncope. Unlike Propranolol, Bisoprolol rarely causes QRS widening, but severe overdose leads to low cardiac output, cardiogenic shock, and acute heart failure.',
  },
  'calcium chloride': {
    toxicThreshold:
      'Rapid IV administration or doses >10–20 mL of 10% Calcium Chloride (1–2 g) causing acute hypercalcaemia.',
    overdoseEffects:
      'Acute hypercalcaemic crisis: metallic or chalky taste, intense peripheral vasodilation with a burning/flushing sensation, nausea, vomiting, confusion, lethargy, hypertension followed by hypotension, shortened QT interval on ECG, bradycardia, heart block, and sudden cardiac arrest (systolic arrest). Extravasation causes severe tissue necrosis.',
  },
  cefalexin: {
    toxicThreshold:
      'Low acute toxicity; single ingestions >5–10 g in adults (>100–200 mg/kg) mainly cause GI symptoms.',
    overdoseEffects:
      'Nausea, vomiting, epigastric distress, abdominal cramps, diarrhoea, and occasional microscopic haematuria. In massive overdose or patients with severe renal impairment, cephalosporin neurotoxicity can provoke confusion, myoclonus, and seizures.',
  },
  chlorphenamine: {
    toxicThreshold:
      '>0.5–1 mg/kg (or >40–60 mg in an adult) causes moderate anticholinergic toxicity; >100–200 mg can cause seizures and arrhythmias.',
    overdoseEffects:
      'Mixed CNS depression and paradoxical anticholinergic excitation: drowsiness or agitation/delirium, hallucinations, sinus tachycardia, dilated pupils, dry mouth and flushed skin, urinary retention, hyperpyrexia, tremor, generalised seizures, and in massive ingestions, QRS widening or QTc prolongation.',
  },
  citalopram: {
    toxicThreshold:
      '>200 mg requires cardiac monitoring; >400–600 mg carries a high risk of QTc prolongation, Torsades de Pointes, and seizures.',
    overdoseEffects:
      'More cardiotoxic in overdose than other SSRIs: causes sinus tachycardia, nausea, vomiting, tremor, agitation, hyperreflexia/clonus (Serotonin Syndrome), generalised seizures, and dose-dependent QTc prolongation (often delayed up to 8–24 hours post-ingestion) which can degenerate into Torsades de Pointes.',
  },
  clarithromycin: {
    toxicThreshold:
      '>2–4 g acute ingestion in adults.',
    overdoseEffects:
      'Severe gastrointestinal distress (nausea, vomiting, abdominal cramping, diarrhoea), reversible hearing loss/tinnitus at very high doses, confusion, and QTc interval prolongation on the 12-lead ECG with a risk of polymorphic ventricular tachycardia (Torsades de Pointes).',
  },
  clindamycin: {
    toxicThreshold:
      'Low acute oral toxicity (>3–5 g); rapid undiluted IV bolus can cause acute cardiovascular collapse.',
    overdoseEffects:
      'Oral overdose primarily causes severe nausea, vomiting, abdominal pain, and diarrhoea (with subsequent risk of C. difficile colitis). Rapid IV overdose causes hypotension, arrhythmias, and cardiac arrest.',
  },
  clopidogrel: {
    toxicThreshold:
      '>600–1,500 mg acute ingestion irreversibly inhibits platelet aggregation for the 7–10 day lifespan of platelets.',
    overdoseEffects:
      'Often asymptomatic until bleeding occurs; may cause mild nausea, vomiting, and dyspepsia. Clinical danger is prolonged, irreversible platelet dysfunction leading to severe haemorrhage (epistaxis, GI bleeding, haematomas, or intracranial haemorrhage after minor trauma) with secondary tachycardia and hypotension.',
  },
  'co-amoxiclav': {
    toxicThreshold:
      'Low acute toxicity; >250 mg/kg (based on amoxicillin component) causes significant GI upset and crystalluria risk.',
    overdoseEffects:
      'Prominent nausea, vomiting, abdominal pain, and diarrhoea (clavulanic acid markedly increases GI motility). Very large overdoses can cause dehydration, electrolyte imbalance, amoxicillin crystalluria, and acute renal impairment.',
  },
  codeine: {
    toxicThreshold:
      '>2–3 mg/kg (or >150–240 mg in an opioid-naive adult) causes significant opioid toxicity; >500–800 mg can be fatal. Always check for co-formulated Paracetamol (Co-codamol).',
    overdoseEffects:
      'Classic opioid toxidrome (plus histamine release): pinpoint pupils (miosis), progressive CNS depression (drowsiness to coma), respiratory depression (bradypnoea <8–10 breaths/min, shallow tidal volume, hypoxia/hypercapnia), hypotension, bradycardia, intense pruritus/flushing, and nausea/vomiting.',
  },
  'codeine phosphate': {
    toxicThreshold:
      '>2–3 mg/kg (or >150–240 mg in an opioid-naive adult) causes significant opioid toxicity; >500–800 mg can be fatal. Always check for co-formulated Paracetamol (Co-codamol).',
    overdoseEffects:
      'Classic opioid toxidrome (plus histamine release): pinpoint pupils (miosis), progressive CNS depression (drowsiness to coma), respiratory depression (bradypnoea <8–10 breaths/min, shallow tidal volume, hypoxia/hypercapnia), hypotension, bradycardia, intense pruritus/flushing, and nausea/vomiting.',
  },
  cyclizine: {
    toxicThreshold:
      '>3–5 mg/kg (or >200–300 mg in an adult) produces marked anticholinergic toxicity.',
    overdoseEffects:
      'Pronounced central and peripheral antimuscarinic features: marked sinus tachycardia, dry mouth, dilated pupils, flushed warm skin, urinary retention, ataxia, slurred speech, severe agitation, visual hallucinations, acute delirium, dystonic reactions, and generalised seizures.',
  },
  dabigatran: {
    toxicThreshold:
      'Any acute overdose (>300–600 mg) causes profound direct thrombin (Factor IIa) inhibition and bleeding risk.',
    overdoseEffects:
      'Dyspepsia and gastritis followed by spontaneous or trauma-related haemorrhage (GI bleeding, epistaxis, haematuria, or intracranial bleeding). Vital signs show progressive tachycardia, pallor, and hypotension if significant blood loss occurs.',
  },
  dexamethasone: {
    toxicThreshold:
      'Single acute oral/IV overdoses (>40–100 mg) rarely cause life-threatening acute toxicity.',
    overdoseEffects:
      'Acute ingestion may cause nausea, gastric irritation, hyperglycaemia (especially in diabetics), insomnia, severe restlessness, agitation, or acute steroid psychosis/euphoria, along with transient sodium/fluid retention and mild hypertension.',
  },
  diazepam: {
    toxicThreshold:
      '>50–100 mg in an adult causes moderate-to-severe sedation; life-threatening respiratory arrest occurs primarily in mixed overdoses with alcohol or opioids or after rapid IV boluses.',
    overdoseEffects:
      'Slurred speech (dysarthria), ataxia, nystagmus, hypotonia, drowsiness progressing to stupor/coma, mild hypotension, and hypothermia. Isolated oral benzodiazepine overdose rarely causes fatal respiratory depression, but when combined with alcohol, opioids, or pregabalin it causes profound bradypnoea, airway loss, and respiratory arrest.',
  },
  diclofenac: {
    toxicThreshold:
      '>5–10 mg/kg (or >300–500 mg in an adult) causes moderate GI/renal toxicity; >1.5–2 g can cause CNS toxicity and metabolic acidosis.',
    overdoseEffects:
      'Epigastric pain, nausea, vomiting, haematemesis, melaena, tinnitus, headache, and lethargy. More likely than Ibuprofen in large overdoses to cause acute kidney injury (oliguria, fluid retention), tinnitus, confusion, myoclonic jerks, generalised seizures (especially in children), and high-anion-gap metabolic acidosis.',
  },
  'diclofenac sodium': {
    toxicThreshold:
      '>5–10 mg/kg (or >300–500 mg in an adult) causes moderate GI/renal toxicity; >1.5–2 g can cause CNS toxicity and metabolic acidosis.',
    overdoseEffects:
      'Epigastric pain, nausea, vomiting, haematemesis, melaena, tinnitus, headache, and lethargy. More likely than Ibuprofen in large overdoses to cause acute kidney injury (oliguria, fluid retention), tinnitus, confusion, myoclonic jerks, generalised seizures (especially in children), and high-anion-gap metabolic acidosis.',
  },
  digoxin: {
    toxicThreshold:
      '>50 mcg/kg (>2,000–3,000 micrograms / 2–3 mg in adults) acute ingestion or serum digoxin >2 ng/mL; chronic toxicity occurs at lower doses in renal failure or hypokalaemia.',
    overdoseEffects:
      'Early severe anorexia, nausea, vomiting, abdominal pain, confusion, lethargy, and classic visual disturbances (blurred vision, yellow-green halos / xanthopsia). Cardiac manifestations include severe bradycardia, AV heart block, atrial tachycardia with block, frequent ventricular ectopics/bigeminy, ventricular tachycardia, and life-threatening hyperkalaemia.',
  },
  doxycycline: {
    toxicThreshold:
      'Low acute systemic toxicity; ingestions >1–2 g primarily cause severe upper GI ulceration.',
    overdoseEffects:
      'Acute nausea, vomiting, epigastric burning, diarrhoea, and severe chemical oesophagitis/oesophageal ulceration (retrosternal chest pain and dysphagia) if tablets are swallowed without sufficient water.',
  },
  edoxaban: {
    toxicThreshold:
      'Any acute ingestion above the 60 mg daily dose (>120 mg) significantly prolongs Factor Xa inhibition and bleeding risk.',
    overdoseEffects:
      'Bruising, epistaxis, gastrointestinal bleeding (haematemesis or melaena), haematuria, or severe internal/intracranial haemorrhage following minor trauma, presenting with tachycardia, pallor, and hypovolaemic hypotension.',
  },
  fentanyl: {
    toxicThreshold:
      'Extremely potent (~100× morphine): >2–3 mcg/kg (>100–200 micrograms IV/IN in an opioid-naive adult), or ingestion/chewing/heating of transdermal fentanyl patches, is rapidly life-threatening.',
    overdoseEffects:
      'Rapid-onset severe opioid toxidrome: coma, pinpoint pupils (miosis), profound respiratory depression progressing rapidly to apnoea and cyanosis, bradycardia, hypotension, and uniquely "wooden chest syndrome" (acute skeletal muscle rigidity of the chest wall and jaw making bag-valve-mask ventilation difficult).',
  },
  flucloxacillin: {
    toxicThreshold:
      'Low acute oral toxicity; ingestions >5–10 g (>150–250 mg/kg) mainly cause gastrointestinal symptoms.',
    overdoseEffects:
      'Nausea, vomiting, abdominal cramps, and diarrhoea. Massive IV doses or severe renal impairment can rarely provoke beta-lactam neurotoxicity (confusion, myoclonic twitching, and seizures).',
  },
  fluoxetine: {
    toxicThreshold:
      '>400–600 mg in adults causes moderate serotonergic symptoms; >1,000–1,500 mg can cause seizures and cardiac conduction delays.',
    overdoseEffects:
      'Nausea, vomiting, agitation, restlessness, sinus tachycardia, dilated pupils, diaphoresis, tremor, hyperreflexia, and inducible clonus (Serotonin Syndrome). Has a very long half-life (days to weeks), though it is less cardiotoxic and less seizure-prone in isolated overdose than Citalopram or Venlafaxine.',
  },
  fluticasone: {
    toxicThreshold:
      'Extremely low acute toxicity via inhaler/nasal spray; acute inhalation of an entire device rarely causes acute systemic toxicity.',
    overdoseEffects:
      'Acute inhalation overdose causes transient throat irritation, cough, hoarseness, and headache. Chronic excessive dosing can cause HPA-axis adrenal suppression or Cushingoid effects.',
  },
  furosemide: {
    toxicThreshold:
      '>200–400 mg acute oral ingestion in a diuretic-naive adult (higher in chronic renal/heart failure patients).',
    overdoseEffects:
      'Massive rapid diuresis leading to severe intravascular volume depletion, dehydration, profound postural and supine hypotension, reflex tachycardia, dizziness, confusion, and syncope. Severe hypokalaemia, hyponatraemia, and hypochloraemic metabolic alkalosis can trigger cardiac arrhythmias, muscle weakness, and tinnitus/deafness (especially after rapid high-dose IV boluses).',
  },
  gabapentin: {
    toxicThreshold:
      '>3–5 g in a naive adult causes significant sedation; due to saturable gut absorption, isolated oral overdoses up to 30–40 g are rarely fatal unless combined with opioids or alcohol.',
    overdoseEffects:
      'Drowsiness, lethargy, dizziness, ataxia, slurred speech, diplopia, nystagmus, myoclonic jerks, mild tachycardia or bradycardia, and mild hypotension. When co-ingested with opioids or benzodiazepines, it acts synergistically to cause severe respiratory depression and coma.',
  },
  gliclazide: {
    toxicThreshold:
      'Even a single tablet (40–80 mg) in a non-diabetic or child, or >160–320 mg in a diabetic adult, can cause severe, prolonged hypoglycaemia.',
    overdoseEffects:
      'Stimulates relentless pancreatic insulin secretion causing profound, prolonged, and recurrent hypoglycaemia (BM <4.0 mmol/L) that can last 24–72 hours (especially modified-release preparations). Presents with sweating, tremor, tachycardia, anxiety, confusion, combativeness, focal neurological deficits mimicking stroke, generalized seizures, and hypoglycaemic coma.',
  },
  glucagon: {
    toxicThreshold:
      'Doses >2–5 mg IV/IM (used terapeutically at 1 mg IM for hypoglycaemia; higher doses of 2–10 mg IV are used intentionally as a beta-blocker overdose antidote).',
    overdoseEffects:
      'Intense nausea, projectile vomiting, transient hyperglycaemia, sinus tachycardia, transient hypertension, and hypokalaemia (due to secondary insulin release driving potassium into cells).',
  },
  glucose: {
    toxicThreshold:
      'Excessive rapid IV administration of 10% or 50% dextrose (>25–50 g bolus without hypoglycaemia).',
    overdoseEffects:
      'Severe hyperglycaemia, hyperosmolar state, osmotic diuresis leading to dehydration, polydipsia, confusion, and phlebitis/severe tissue necrosis if hypertonic glucose extravasates outside the vein.',
  },
  'glyceryl trinitrate': {
    toxicThreshold:
      'Repeated excessive sublingual sprays (>30–50 mcg/kg or >1,600–2,400 micrograms in rapid succession) or accidental ingestion of GTN tablets/patches.',
    overdoseEffects:
      'Profound systemic venodilation and arteriolar dilation causing severe hypotension, syncope, reflex sinus tachycardia (or paradoxical vagal bradycardia), throbbing pounding headache, facial flushing, dizziness, and in massive ingestions, methaemoglobinaemia (cyanosis with falsely low or plateaued SpO2 ~85% unresponsive to oxygen).',
  },
  glycopyrronium: {
    toxicThreshold:
      '>1–2 mg IV/IM or massive oral/inhaled overdose.',
    overdoseEffects:
      'Peripheral antimuscarinic toxidrome (because it is a quaternary ammonium compound, it poorly crosses the blood-brain barrier so central delirium is less marked than with Atropine): marked sinus tachycardia, dry mouth and skin, hyperthermia, blurred vision, dilated pupils, urinary retention, and ileus.',
  },
  'glycopyrronium bromide': {
    toxicThreshold:
      '>1–2 mg IV/IM or massive oral/inhaled overdose.',
    overdoseEffects:
      'Peripheral antimuscarinic toxidrome (because it is a quaternary ammonium compound, it poorly crosses the blood-brain barrier so central delirium is less marked than with Atropine): marked sinus tachycardia, dry mouth and skin, hyperthermia, blurred vision, dilated pupils, urinary retention, and ileus.',
  },
  haloperidol: {
    toxicThreshold:
      '>10–20 mg in a naive adult (or >0.15 mg/kg in children) can cause severe extrapyramidal and cardiac effects.',
    overdoseEffects:
      'CNS depression (drowsiness, lethargy, coma) or agitation, acute dystonic reactions (oculogyric crisis—upward fixed gaze, torticollis, jaw trismus, opisthotonus), postural hypotension, sinus tachycardia, QTc interval prolongation on 12-lead ECG (risk of Torsades de Pointes), and rarely Neuroleptic Malignant Syndrome (lead-pipe muscle rigidity, hyperpyrexia >39°C, autonomic instability).',
  },
  hydrocortisone: {
    toxicThreshold:
      'Very low acute toxicity; single doses >500–1,000 mg IV/oral rarely cause acute life-threatening toxicity.',
    overdoseEffects:
      'Acute nausea, vomiting, hyperglycaemia, sodium and water retention, mild hypertension, facial flushing, insomnia, and acute agitation or steroid-induced euphoria/psychosis.',
  },
  ibuprofen: {
    toxicThreshold:
      '<100 mg/kg is usually asymptomatic; 100–400 mg/kg causes mild-to-moderate GI/CNS effects; >400 mg/kg (or >24–30 g in an adult) causes severe toxicity.',
    overdoseEffects:
      'Onset within 4 hours: nausea, vomiting, epigastric pain, haematemesis, tinnitus, headache, and drowsiness. Massive overdoses (>400 mg/kg) cause high-anion-gap metabolic acidosis, hyperkalaemia, acute kidney injury, hypotension, apnoea/respiratory depression, coma, and generalised seizures.',
  },
  ipratropium: {
    toxicThreshold:
      'Extremely low systemic absorption via inhaler/nebuliser; acute overdose via inhalation (>100 mcg/kg or >5,000 micrograms) rarely causes severe systemic toxicity.',
    overdoseEffects:
      'Dry mouth, throat irritation, metallic taste, mild sinus tachycardia, palpitations, and—if nebuliser mist blows directly into the eyes—unilateral or bilateral fixed dilated pupil (mydriasis) and blurred vision or acute angle-closure glaucoma.',
  },
  'ipratropium bromide': {
    toxicThreshold:
      'Extremely low systemic absorption via inhaler/nebuliser; acute overdose via inhalation (>100 mcg/kg or >5,000 micrograms) rarely causes severe systemic toxicity.',
    overdoseEffects:
      'Dry mouth, throat irritation, metallic taste, mild sinus tachycardia, palpitations, and—if nebuliser mist blows directly into the eyes—unilateral or bilateral fixed dilated pupil (mydriasis) and blurred vision or acute angle-closure glaucoma.',
  },
  'isosorbide mononitrate': {
    toxicThreshold:
      '>120–240 mg acute oral ingestion in adults (lower in nitrate-naive patients or if combined with Sildenafil/PDE-5 inhibitors).',
    overdoseEffects:
      'Severe, prolonged vasodilation causing profound hypotension, orthostatic syncope, reflex sinus tachycardia, throbbing headache, warm flushed skin, nausea, and vomiting. Modified-release tablets prolong hypotension for 12–24 hours; massive overdoses can cause methaemoglobinaemia (central cyanosis and chocolate-brown blood).',
  },
  ketamine: {
    toxicThreshold:
      '>2–4 mg/kg IV or >10 mg/kg IM/oral/insufflated produces deep dissociative anaesthesia and sympathy-driven cardiovascular surge.',
    overdoseEffects:
      'Dissociative stupor ("K-hole": eyes open with nystagmus but unresponsive to external stimuli), marked sinus tachycardia, hypertension, hypersalivation, lacrimation, muscle hypertonicity/rigidity, transient laryngospasm, respiratory depression (if given by rapid IV push or co-ingested with alcohol/opioids), and severe emergence delirium/hallucinations.',
  },
  lactulose: {
    toxicThreshold:
      'Non-toxic systemically; large ingestions (>100–200 mL) act purely as an osmotic cathartic in the gut.',
    overdoseEffects:
      'Abdominal distension, flatulence, colicky abdominal cramps, and profuse osmotic watery diarrhoea, which in frail or elderly patients can lead to dehydration, postural hypotension, and hypernatraemia/hypokalaemia.',
  },
  lansoprazole: {
    toxicThreshold:
      'Very low acute toxicity; single ingestions up to 600 mg in adults cause minimal systemic effects.',
    overdoseEffects:
      'Mild nausea, vomiting, abdominal pain, diarrhoea, headache, dizziness, flushing, and mild sinus tachycardia.',
  },
  levetiracetam: {
    toxicThreshold:
      '>5–10 g in adults causes moderate sedation; generally wide therapeutic index compared with older anticonvulsants.',
    overdoseEffects:
      'Somnolence, lethargy, dizziness, ataxia, diplopia, agitation or aggression, and in massive overdoses (>15–30 g), coma and mild respiratory depression without significant cardiac conduction toxicity.',
  },
  levothyroxine: {
    toxicThreshold:
      '>50–75 mcg/kg (>2,000–5,000 micrograms / 2–5 mg in adults) can cause delayed thyrotoxicosis (peaking 3–10 days post-ingestion as T4 converts to active T3).',
    overdoseEffects:
      'Often asymptomatic for the first 24–72 hours, followed by delayed sympathomimetic/thyrotoxic storm: persistent sinus tachycardia, atrial fibrillation, hypertension, widened pulse pressure, fever/hyperpyrexia, profuse sweating, fine tremor, severe agitation, anxiety, diarrhoea, and confusion.',
  },
  lidocaine: {
    toxicThreshold:
      '>3–4.5 mg/kg IV/infiltrated (without adrenaline) or >300 mg total causes Local Anaesthetic Systemic Toxicity (LAST).',
    overdoseEffects:
      'Biphasic CNS and cardiac sodium-channel toxicity: early circumoral numbness, metallic taste, tinnitus, lightheadedness, slurred speech, visual disturbances, and muscle twitching, rapidly progressing to generalised tonic-clonic seizures, coma, respiratory arrest, PR/QRS widening, severe bradycardia, AV block, hypotension, and refractory ventricular arrhythmias/asystole.',
  },
  lorazepam: {
    toxicThreshold:
      '>10–20 mg in a benzodiazepine-naive adult causes marked sedation; high risk of respiratory depression when co-ingested with alcohol or opioids.',
    overdoseEffects:
      'Profound drowsiness, slurred speech, ataxia, hypotonia, paradoxical agitation (occasionally in elderly/children), mild hypotension, hypothermia, and—in mixed overdoses or frail patients—hypoventilation, loss of airway reflexes, and coma.',
  },
  losartan: {
    toxicThreshold:
      '>300–500 mg acute ingestion in adults.',
    overdoseEffects:
      'Vasodilatory hypotension, postural dizziness, syncope, and reflex sinus tachycardia (or occasional vagal bradycardia). Massive overdoses or co-ingestion with diuretics/NSAIDs can precipitate oliguric acute kidney injury and hyperkalaemia (peaked T waves, widened QRS).',
  },
  macrogol: {
    toxicThreshold:
      'Low systemic absorption; ingestion of >8–16 sachets causes osmotic diarrhoea and fluid/electrolyte shifts.',
    overdoseEffects:
      'Abdominal bloating, colicky pain, nausea, vomiting, and profuse watery diarrhoea. If taken without adequate water (or in massive excess), it can cause dehydration, thirst, postural hypotension, and electrolyte disturbances (hypernatraemia or hyponatraemia/hypokalaemia).',
  },
  'magnesium sulfate': {
    toxicThreshold:
      'Rapid IV infusion >4–8 g (or lower in renal failure) causing serum magnesium >2.5–4 mmol/L (hypermagnesaemia).',
    overdoseEffects:
      'Facial flushing, intense warmth, nausea, vomiting, lethargy, slurred speech, progressive loss of deep tendon reflexes (patellar reflex disappears early), profound skeletal muscle flaccid paralysis, respiratory muscle paralysis/apnoea, vasodilatory hypotension, bradycardia, PR/QRS prolongation, complete heart block, and cardiac arrest.',
  },
  mebeverine: {
    toxicThreshold:
      '>1.5–2 g acute ingestion in adults.',
    overdoseEffects:
      'Usually mild gastrointestinal upset, dizziness, headache, confusion, restlessness, mild anticholinergic-like agitation, tremor, and mild hypotension or sinus tachycardia; massive overdoses have rarely been associated with seizures.',
  },
  metformin: {
    toxicThreshold:
      '>5–10 g in adults (or lower in renal impairment) carries a high risk of life-threatening Metformin-Associated Lactic Acidosis (MALA).',
    overdoseEffects:
      'Does NOT typically cause hypoglycaemia in isolated overdose (unless co-ingested with sulfonylureas/insulin), though mild hyperglycaemia or hypoglycaemia can occur. Instead, it causes severe nausea, vomiting, abdominal pain, diarrhoea, hypothermia, hypotension, and profound high-anion-gap lactic acidosis (presenting with compensatory rapid deep Kussmaul tachypnoea, confusion, shock, and cardiovascular collapse).',
  },
  methoxyflurane: {
    toxicThreshold:
      'Exceeding the maximum daily dose of two 3 mL vials (6 mL total in 24 hours, or >15 mL in a week).',
    overdoseEffects:
      'Acute excessive inhalation causes deep CNS sedation, slurred speech, ataxia, dizziness, hypotension, bradycardia, and respiratory depression. Exceeding the 6 mL dose limit causes fluoride-induced nephrotoxicity (polyuric or oliguric acute kidney injury) and hepatotoxicity.',
  },
  metoclopramide: {
    toxicThreshold:
      '>30–50 mg in adults (or >0.5 mg/kg in children and young adults under 20) frequently triggers acute extrapyramidal reactions.',
    overdoseEffects:
      'Drowsiness, confusion, agitation, mild sinus tachycardia, and classic acute dystonic reactions: oculogyric crisis (involuntary upward deviation of the eyes), spasmodic torticollis (neck twisting), jaw trismus, facial grimacing, and opisthotonus. Very rarely causes methaemoglobinaemia or Neuroleptic Malignant Syndrome.',
  },
  metoprolol: {
    toxicThreshold:
      '>400–600 mg in a non-tolerant adult (or >5–7.5 mg/kg).',
    overdoseEffects:
      'Severe sinus bradycardia, AV conduction block (1st to 3rd degree), refractory hypotension, cardiogenic shock, cold cyanosed peripheries, lethargy, coma, bronchospasm, and in severe overdoses, mild sodium-channel QRS widening and seizures.',
  },
  midazolam: {
    toxicThreshold:
      '>10–15 mg IV/IM in an adult (or >5 mg in elderly/frail patients) rapidly causes apnoea and loss of airway reflexes.',
    overdoseEffects:
      'Rapid onset of deep sedation, slurred speech, hypotonia, loss of protective pharyngeal airway reflexes, central respiratory depression (bradypnoea, shallow tidal volumes, hypoxia, hypercapnic respiratory arrest), hypotension, and coma.',
  },
  misoprostol: {
    toxicThreshold:
      '>20–40 mcg/kg (>1,600–3,000 micrograms in adults); any dose in pregnancy causes potent uterine hyperstimulation.',
    overdoseEffects:
      'Severe cramping abdominal pain, profuse watery diarrhoea, nausea, vomiting, high fever/hyperpyrexia, shivering/rigors, sinus tachycardia, hypotension (or transient hypertension), tremor, agitation, and—in pregnant patients—tetanic uterine contractions, fetal bradycardia, uterine rupture, and severe vaginal haemorrhage.',
  },
  montelukast: {
    toxicThreshold:
      'Very low acute toxicity; ingestions up to 500–1,000 mg in adults and children rarely cause severe systemic effects.',
    overdoseEffects:
      'Usually asymptomatic or mild symptoms: abdominal pain, thirst, headache, somnolence, mydriasis, or mild psychomotor agitation/restlessness and nightmares.',
  },
  morphine: {
    toxicThreshold:
      '>30–60 mg oral (or >10–20 mg IV/IM) in an opioid-naive adult causes severe toxicity; modified-release preparations (MST Continus, Zomorph) cause delayed, prolonged toxicity over 12–24+ hours.',
    overdoseEffects:
      'Classic life-threatening opioid toxidrome triad: pinpoint pupils (miosis), progressive CNS depression (drowsiness to unresponsive coma), and profound respiratory depression (respiratory rate <8/min, shallow breathing, apnoea, hypoxia, and hypercapnia), accompanied by bradycardia, hypotension, hypothermia, and absent bowel sounds.',
  },
  'morphine sulfate': {
    toxicThreshold:
      '>30–60 mg oral (or >10–20 mg IV/IM) in an opioid-naive adult causes severe toxicity; modified-release preparations (MST Continus, Zomorph) cause delayed, prolonged toxicity over 12–24+ hours.',
    overdoseEffects:
      'Classic life-threatening opioid toxidrome triad: pinpoint pupils (miosis), progressive CNS depression (drowsiness to unresponsive coma), and profound respiratory depression (respiratory rate <8/min, shallow breathing, apnoea, hypoxia, and hypercapnia), accompanied by bradycardia, hypotension, hypothermia, and absent bowel sounds.',
  },
  naloxone: {
    toxicThreshold:
      'In opioid-dependent patients, boluses >5–10 mcg/kg (>400–800 micrograms IV) precipitate acute severe opioid withdrawal (wide safety margin in opioid-naive patients).',
    overdoseEffects:
      'In opioid-dependent patients, excessive Naloxone triggers acute precipitated withdrawal: extreme agitation and combativeness, profuse sweating, piloerection, severe nausea and projectile vomiting (aspiration risk), diarrhoea, marked sinus tachycardia, severe hypertension, and rarely catecholamine-surge flash pulmonary oedema or ventricular arrhythmias.',
  },
  naproxen: {
    toxicThreshold:
      '>100–200 mg/kg (or >5–10 g in an adult) causes moderate GI/CNS symptoms; >300–400 mg/kg causes severe metabolic and neurological toxicity.',
    overdoseEffects:
      'Epigastric pain, nausea, vomiting, haematemesis, drowsiness, dizziness, tinnitus, and headache. Massive overdoses cause high-anion-gap metabolic acidosis, acute kidney injury, GI haemorrhage, confusion, stupor, and generalised tonic-clonic seizures.',
  },
  nitrofurantoin: {
    toxicThreshold:
      'Low acute toxicity; single ingestions >1–2 g primarily cause gastrointestinal distress.',
    overdoseEffects:
      'Acute nausea, vomiting, epigastric pain, headache, dizziness, and dark yellow or brown discolouration of the urine. Rarely causes acute haemolysis in patients with G6PD deficiency.',
  },
  'nitrous oxide': {
    toxicThreshold:
      'Inhalation in hypoxic mixtures (>50–70% N2O without adequate oxygen) or prolonged heavy recreational misuse ("whippits" / canisters).',
    overdoseEffects:
      'Acute excessive inhalation causes euphoria, dizziness, slurred speech, confusion, hypoxia/asphyxiation (if inhaled pure from canisters/balloons), hypotension, and loss of consciousness. Chronic heavy misuse inactivates Vitamin B12, presenting with subacute combined degeneration of the spinal cord (ascending paraesthesia, numb legs, ataxia, and paraparesis).',
  },
  omeprazole: {
    toxicThreshold:
      'Very low acute toxicity; single ingestions up to 1,200–2,400 mg in adults are generally well tolerated.',
    overdoseEffects:
      'Nausea, vomiting, abdominal pain, diarrhoea, dizziness, headache, drowsiness, flushing, dry mouth, and mild sinus tachycardia.',
  },
  ondansetron: {
    toxicThreshold:
      '>32 mg IV/oral in adults (or >1–2 mg/kg in children) carries a significant risk of QTc prolongation and serotonin toxicity.',
    overdoseEffects:
      'Headache, dizziness, flushing, transient visual disturbances (blurred vision), constipation, hypotension or hypertension, dose-dependent QTc prolongation on the 12-lead ECG (risk of Torsades de Pointes), and in large overdoses—especially with SSRIs—Serotonin Syndrome (agitation, tremor, clonus, hyperthermia) and seizures.',
  },
  oxycodone: {
    toxicThreshold:
      'Approximately 1.5–2× as potent as oral morphine: >20–40 mg in an opioid-naive adult causes severe toxicity; modified-release OxyContin causes prolonged respiratory depression over 12–24 hours.',
    overdoseEffects:
      'Potent opioid toxidrome: pinpoint pupils (miosis), CNS depression progressing from somnolence to deep coma, severe bradypnoea and apnoea, hypoxia, hypotension, bradycardia, hypothermia, and mild QTc prolongation at very high doses.',
  },
  oxygen: {
    toxicThreshold:
      'Uncontrolled high-concentration oxygen (FiO2 >28–35%) in patients with chronic hypercapnic COPD (target SpO2 88–92%), or prolonged FiO2 >60% for >24–48 hours.',
    overdoseEffects:
      'In chronic CO2-retaining COPD patients, excessive oxygen causes hyperoxic hypercapnic respiratory failure (via V/Q mismatch, Haldane effect, and reduced respiratory drive): bounding pulse, warm peripheries, flapping tremor (asterixis), headache, confusion, progressive drowsiness, respiratory acidosis, and eventual CO2 narcosis/coma.',
  },
  paracetamol: {
    toxicThreshold:
      '>75 mg/kg in 24 hours is the clinical threshold for potential hepatotoxicity; >150 mg/kg (or >12 g in an adult) carries a high risk of severe liver necrosis.',
    overdoseEffects:
      'Crucial clinical trap: patients are often completely asymptomatic for the first 24 hours (or have only mild nausea, vomiting, and pallor). Between 24–72 hours, right upper quadrant (RUQ) abdominal pain and liver tenderness develop; after 72 hours, fulminant hepatic failure ensues with jaundice, coagulopathy, hypoglycaemia, hepatic encephalopathy (confusion to coma), lactic acidosis, and renal failure.',
  },
  penthrox: {
    toxicThreshold:
      'Exceeding the maximum daily dose of two 3 mL vials (6 mL total in 24 hours, or >15 mL in a week).',
    overdoseEffects:
      'Acute excessive inhalation causes deep CNS sedation, slurred speech, ataxia, dizziness, hypotension, bradycardia, and respiratory depression. Exceeding the 6 mL dose limit causes fluoride-induced nephrotoxicity (polyuric or oliguric acute kidney injury) and hepatotoxicity.',
  },
  pivmecillinam: {
    toxicThreshold:
      'Low acute toxicity; single ingestions >4–6 g primarily cause gastrointestinal upset.',
    overdoseEffects:
      'Nausea, vomiting, epigastric pain, oesophageal irritation/ulceration, and diarrhoea. Prolonged excessive use can deplete systemic carnitine stores, causing muscle weakness.',
  },
  prednisolone: {
    toxicThreshold:
      'Very low acute toxicity; single oral overdoses (>200–500 mg) rarely cause life-threatening acute effects.',
    overdoseEffects:
      'Acute nausea, vomiting, epigastric discomfort, hyperglycaemia (particularly in diabetic patients, potentially precipitating DKA or HHS), insomnia, restlessness, agitation, or acute steroid psychosis, and mild fluid retention/hypertension.',
  },
  pregabalin: {
    toxicThreshold:
      '>600–900 mg in a naive adult causes marked CNS depression; high risk of fatal respiratory arrest when co-ingested with opioids, benzodiazepines, or alcohol.',
    overdoseEffects:
      'Somnolence, confusion, agitation, restlessness, ataxia, slurred speech, dizziness, prominent myoclonic jerks/tremor, mild hypotension, and bradycardia. While isolated Pregabalin overdose rarely causes apnoea, co-ingestion with opioids or alcohol causes severe synergistic respiratory depression and coma.',
  },
  prochlorperazine: {
    toxicThreshold:
      '>50–100 mg in adults (or >0.5–1 mg/kg in children) frequently causes CNS depression and acute dystonic reactions.',
    overdoseEffects:
      'Drowsiness progressing to coma, agitation or restlessness, postural hypotension, reflex sinus tachycardia, anticholinergic dry mouth/blurred vision, QTc prolongation on ECG, and acute extrapyramidal dystonic spasms (oculogyric crisis, torticollis, jaw trismus, and laryngospasm).',
  },
  propranolol: {
    toxicThreshold:
      'The most lethal beta-blocker in overdose: >400–600 mg in an adult (>5 mg/kg) causes severe toxicity; >1–2 g is frequently fatal.',
    overdoseEffects:
      'Because Propranolol is highly lipophilic (crosses the blood-brain barrier) and blocks cardiac fast sodium channels, overdose presents with a deadly triad within 1–2 hours: (1) profound bradycardia and AV block, (2) broad-complex QRS widening (>100–120 ms), ventricular arrhythmias, and refractory cardiogenic shock/hypotension, and (3) rapid onset of coma, delirium, and generalised tonic-clonic seizures, plus bronchospasm and hypoglycaemia.',
  },
  quetiapine: {
    toxicThreshold:
      '>1–1.5 g in a naive adult causes significant CNS and cardiovascular toxicity; >3 g causes deep coma and severe hypotension.',
    overdoseEffects:
      'Rapid-onset sedation progressing to deep coma (often requiring intubation for airway protection), marked sinus tachycardia, orthostatic and supine hypotension (via alpha-1 blockade), anticholinergic delirium/agitation, miosis or mydriasis, respiratory depression, QTc interval prolongation, and generalised seizures.',
  },
  ramipril: {
    toxicThreshold:
      '>50–100 mg acute oral ingestion in adults.',
    overdoseEffects:
      'Profound peripheral vasodilation causing prolonged hypotension (peaking 4–8 hours post-ingestion and lasting 24+ hours), postural dizziness, syncope, and mild reflex tachycardia or bradycardia. May also cause hyperkalaemia and acute kidney injury (especially in dehydrated patients or those also taking NSAIDs/diuretics).',
  },
  rivaroxaban: {
    toxicThreshold:
      'Any acute overdose (>40–60 mg) elevates bleeding risk; note that oral absorption has a ceiling effect above 50 mg.',
    overdoseEffects:
      'Often asymptomatic initially until spontaneous or trauma-induced bleeding develops: epistaxis, gingival bleeding, haematemesis, melaena, haematuria, or intracranial haemorrhage. Vital signs reflect blood loss with compensatory sinus tachycardia and hypotension.',
  },
  salbutamol: {
    toxicThreshold:
      'Oral ingestion >0.5–1 mg/kg (e.g. drinking salbutamol syrup/nebuliser liquid) or excessive continuous back-to-back nebulisation (>20–30 mg).',
    overdoseEffects:
      'Exaggerated beta-2 adrenergic stimulation: marked sinus tachycardia (often 130–160+ bpm), supraventricular arrhythmias, widened pulse pressure with diastolic hypotension, coarse skeletal muscle tremor, agitation, anxiety, nausea, hyperglycaemia, hypokalaemia (potassium driven intracellularly causing U waves and ectopics), and transient lactic acidosis causing tachypnoea.',
  },
  senna: {
    toxicThreshold:
      'Low systemic toxicity; >10–20 tablets (>75–150 mg sennosides) causes severe catharsis.',
    overdoseEffects:
      'Severe gripping abdominal cramps, nausea, and profuse watery diarrhoea beginning 6–12 hours after ingestion, potentially leading to fluid depletion, postural hypotension, and hypokalaemia.',
  },
  sertraline: {
    toxicThreshold:
      '>500–1,000 mg in adults causes moderate serotonergic toxicity; generally safer in isolated overdose than Citalopram or tricyclics.',
    overdoseEffects:
      'Nausea, vomiting, diarrhoea, dizziness, drowsiness or agitation, tremor, diaphoresis, sinus tachycardia, mydriasis, hyperreflexia, and lower-limb clonus (Serotonin Syndrome). Seizures and significant QTc prolongation are uncommon unless massive doses (>2–3 g) or co-ingestants (e.g. Tramadol) are taken.',
  },
  simvastatin: {
    toxicThreshold:
      'Low acute toxicity; single ingestions >400–800 mg rarely cause acute life-threatening symptoms.',
    overdoseEffects:
      'Mild nausea, vomiting, diarrhoea, abdominal discomfort, and headache. Very large ingestions or drug interactions carry a delayed risk of myalgia, muscle weakness, and rhabdomyolysis.',
  },
  sitagliptin: {
    toxicThreshold:
      'Low acute toxicity; single ingestions up to 800 mg in adults rarely cause severe hypoglycaemia unless combined with sulfonylureas or insulin.',
    overdoseEffects:
      'Mild gastrointestinal upset (nausea, abdominal pain — evaluate severe epigastric pain for acute pancreatitis), headache, dizziness, and mild hypoglycaemia only if co-ingested with Gliclazide or Insulin.',
  },
  'sodium chloride': {
    toxicThreshold:
      'Excessive rapid IV infusion (>2–3 L in normovolaemic/heart failure patients) or accidental ingestion of large amounts of salt (>0.5–1 g/kg).',
    overdoseEffects:
      'IV fluid overload causes raised JVP, peripheral oedema, tachypnoea, bibasal fine crackles (acute pulmonary oedema), hypoxia, and hyperchloraemic metabolic acidosis. Massive oral salt ingestion causes severe hypernatraemia: intense thirst, nausea, vomiting, hypertension, tachycardia, confusion, lethargy, intracranial haemorrhage (from brain shrinkage), seizures, and coma.',
  },
  'sodium valproate': {
    toxicThreshold:
      '>200 mg/kg causes significant CNS depression; >400 mg/kg causes severe, life-threatening multi-organ toxicity (modified-release Epilim Chrono delays peak toxicity up to 12–18 hours).',
    overdoseEffects:
      'Progressive drowsiness to deep coma (which can mimic opioid overdose with miosis and respiratory depression), hypotension, tachycardia, hyperammonaemic encephalopathy, cerebral oedema (developing 12–72 hours post-ingestion), high-anion-gap metabolic acidosis, hypernatraemia (from the sodium salt load), hypocalcaemia, and bone marrow suppression.',
  },
  syntometrine: {
    toxicThreshold:
      '>10 mcg/kg of the ergometrine component (more than 1–2 ampoules IM, accidental IV injection, or administration to a patient with severe hypertension/pre-eclampsia).',
    overdoseEffects:
      'Driven primarily by the Ergometrine component: severe systemic and coronary vasoconstriction causing acute hypertensive crisis (severe pounding headache, blurred vision, risk of stroke/seizures/eclampsia), coronary artery spasm (angina or myocardial infarction), bradycardia or tachycardia, intense nausea and vomiting, and tetanic uterine hypertonus.',
  },
  ticagrelor: {
    toxicThreshold:
      '>360–900 mg acute ingestion in adults (note that unlike Clopidogrel, platelet transfusions are less effective within 24 hours because circulating Ticagrelor binds transfused platelets).',
    overdoseEffects:
      'Major spontaneous or post-traumatic haemorrhage (GI bleeding, epistaxis, haematuria, intracranial haemorrhage), dyspnoea (feeling of air hunger/shortness of breath even with normal SpO2), nausea, vomiting, and asymptomatic ventricular pauses/bradycardia on ECG.',
  },
  tiotropium: {
    toxicThreshold:
      'Very low systemic absorption via inhaler; acute inhalation of multiple capsules/puffs (>2–4 mcg/kg or >100–300 micrograms) causes mild antimuscarinic effects.',
    overdoseEffects:
      'Dry mouth, dry throat, mild sinus tachycardia, blurred vision, dilated pupils (especially if powder contacts the eyes), constipation, and difficulty passing urine in patients with prostatic hypertrophy.',
  },
  tramadol: {
    toxicThreshold:
      '>500 mg in an adult (>5–10 mg/kg) carries a high risk of seizures and respiratory depression.',
    overdoseEffects:
      'Dual opioid and monoamine (serotonin/noradrenaline) toxidrome: unlike pure opioids, Tramadol overdose frequently causes generalised tonic-clonic seizures (even at moderate doses), agitation, sinus tachycardia, hypertension, diaphoresis, hyperreflexia/clonus (Serotonin Syndrome), alongside opioid CNS depression, pinpoint or dilated pupils, and respiratory depression.',
  },
  'tranexamic acid': {
    toxicThreshold:
      'Doses >2–4 g IV (or rapid IV bolus >100 mg/min) or massive oral ingestion (>10 g).',
    overdoseEffects:
      'Rapid IV injection causes acute vasodilatory hypotension, dizziness, nausea, and vomiting. High doses inhibit CNS GABA and glycine receptors, lowering the seizure threshold and causing myoclonic twitching, agitation, visual colour disturbances, generalized tonic-clonic seizures, and an increased risk of arterial or venous thromboembolism.',
  },
  trimethoprim: {
    toxicThreshold:
      '>1–2 g acute oral ingestion in adults.',
    overdoseEffects:
      'Nausea, vomiting, epigastric distress, headache, dizziness, confusion, and—over 24–72 hours—hyperkalaemia (by blocking renal tubular potassium excretion, similar to amiloride) and bone marrow folate deficiency.',
  },
  warfarin: {
    toxicThreshold:
      'Acute ingestion >0.5 mg/kg (or >20–50 mg in an adult), or chronic over-anticoagulation (INR >5–8).',
    overdoseEffects:
      'After an acute single overdose, INR prolongation is delayed by 12–48 hours (as existing clotting factors must first be cleared). Clinical presentation is spontaneous or trauma-induced haemorrhage: epistaxis, bruising, haematuria, haematemesis, melaena, retroperitoneal bleeding, or intracranial haemorrhage, accompanied by tachycardia, pallor, and hemorrhagic shock.',
  },
  zopiclone: {
    toxicThreshold:
      '>30–50 mg in an adult causes moderate-to-severe CNS depression; high risk of respiratory depression when co-ingested with alcohol or opioids.',
    overdoseEffects:
      'Bitter/metallic taste, slurred speech, ataxia, drowsiness progressing to stupor or coma, hypotonia, mild hypotension, and bradycardia. Rarely causes methaemoglobinaemia in massive overdoses (>150–300 mg), and causes life-threatening hypoventilation/apnoea when combined with alcohol, benzodiazepines, or opioids.',
  },
};

/**
 * Looks up pre-generated toxicity/overdose details for a drug by matching either the exact
 * drug name or its base UK generic name (e.g. "Bisoprolol fumarate" -> "bisoprolol",
 * "Morphine sulfate 10mg/1ml..." -> "morphine sulfate" / "morphine").
 */
export function findPregeneratedToxicityDetails(
  drugName: string
): GeminiToxicityDetails | undefined {
  const normalized = drugName.trim().toLowerCase();

  // 1. Direct exact key match
  if (PREGENERATED_TOXICITY_DETAILS[normalized]) {
    return PREGENERATED_TOXICITY_DETAILS[normalized];
  }

  // 2. Match longest prefix / word-boundary key (e.g., "Amiodarone hydrochloride" -> "amiodarone")
  const keys = Object.keys(PREGENERATED_TOXICITY_DETAILS).sort(
    (a, b) => b.length - a.length
  );

  for (const key of keys) {
    if (
      normalized === key ||
      normalized.startsWith(`${key} `) ||
      normalized.startsWith(`${key} (`) ||
      normalized.includes(`(${key})`)
    ) {
      return PREGENERATED_TOXICITY_DETAILS[key];
    }
  }

  // 3. Match salt-omitted generic bases (e.g. "glycopyrronium" -> "glycopyrronium bromide")
  if (normalized.length >= 5) {
    for (const key of keys) {
      if (key.startsWith(`${normalized} `)) {
        return PREGENERATED_TOXICITY_DETAILS[key];
      }
    }
  }

  return undefined;
}
