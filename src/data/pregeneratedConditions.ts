import { ClinicalConditionItem } from '../types/condition';

export const UNCOMMON_COMPLEX_CATEGORY = 'Uncommon & Complex PMH';

export const UNCOMMON_COMPLEX_IDS = [
  'motor-neurone-disease',
  'addisons-disease',
  'myasthenia-gravis',
  'guillain-barre-syndrome',
  'postural-tachycardia-syndrome',
  'ehlers-danlos-syndrome',
  'sickle-cell-disease',
  'systemic-lupus-erythematosus',
  'phaeochromocytoma',
  'huntingtons-disease',
] as const;

export const CONDITION_CATEGORIES = [
  UNCOMMON_COMPLEX_CATEGORY,
  'Neurological',
  'Cardiovascular',
  'Respiratory',
  'Endocrine & Metabolic',
  'Autoimmune & Haematology',
  'GI, Hepatic & Renal',
] as const;

export const PREGENERATED_CONDITIONS: ClinicalConditionItem[] = [
  // =========================================================================
  // 1. NEUROLOGICAL (7)
  // =========================================================================
  {
    id: 'motor-neurone-disease',
    title: 'Motor Neurone Disease (MND)',
    phoneticSpelling: 'MOH-ter NYOOR-ohn dih-ZEEZ',
    category: 'Neurological',
    aliases: [
      'mnd',
      'als',
      'amyotrophic lateral sclerosis',
      'bulbar palsy',
      'progressive bulbar palsy',
      'primary lateral sclerosis',
      'progressive muscular atrophy',
      'lou gehrig',
    ],
    overview:
      'A progressive neurodegenerative disorder affecting upper and lower motor neurones in the brain and spinal cord. Muscles waste and weaken over time—including those used for swallowing, speech, and breathing—while intellect and sensory nerves are usually preserved.',
    causesAndPathophysiology: [
      'Motor Neurone Loss: Progressive degeneration of both upper and lower motor neurones disrupts voluntary muscle signalling.',
      'Aetiology: Around 90–95% of cases are sporadic; 5–10% are familial (e.g. C9orf72 or SOD1 gene variants).',
      'Denervation: Loss of lower motor neurones causes muscle wasting and fasciculations, while upper motor neurone damage causes spasticity and brisk reflexes.',
      'Respiratory Decline: Diaphragmatic and intercostal weakness leads to chronic nocturnal hypoventilation and hypercapnic respiratory failure.',
    ],
    symptomsAndBaseline: [
      'Limb Weakness: Progressive asymmetric weakness, foot drop, hand clumsiness, muscle wasting, and visible fasciculations.',
      'Bulbar Features: Slurred speech (dysarthria), weak cough, difficulty swallowing (dysphagia), and pooling of saliva.',
      'Preserved Cognition: Most patients understand everything clearly despite severe speech impairment.',
      'Home Equipment: Frequently have nocturnal or continuous NIV (BiPAP), cough-assist machines, or PEG/RIG feeding tubes.',
    ],
    treatments: [
      'Disease Modification: Riluzole slows progression modestly by reducing glutamate excitotoxicity.',
      'Symptom Control: Baclofen or tizanidine for spasticity; hyoscine, glycopyrronium, or carbocisteine for secretions.',
      'Respiratory Support: Domiciliary NIV (non-invasive ventilation) and mechanical cough-assist devices.',
      'Nutrition & MDT Care: Early gastrostomy (PEG/RIG) tube placement and specialist palliative/neurology care plans.',
    ],
    commonMeds: ['Riluzole', 'Baclofen', 'Hyoscine hydrobromide', 'Glycopyrronium', 'Carbocisteine'],
    paramedicTakeaways: [
      'Oxygen Caution: Do not give high-flow O₂ routinely; patients with ventilatory failure are prone to CO₂ retention—titrate carefully (88–92% if chronic hypercapnia) and bring their home NIV.',
      'Choking & Aspiration: High risk of silent aspiration and mucus plugging; have suction ready and keep upright if tolerated.',
      'Advance Care Plans: Always ask family/carers early for ReSPECT forms, DNACPR decisions, or preferred place of care.',
      'Communication: Assume full mental capacity unless proven otherwise; use communication boards or yes/no eye signals.',
    ],
  },
  {
    id: 'myasthenia-gravis',
    title: 'Myasthenia Gravis',
    phoneticSpelling: 'my-ess-THEE-nee-uh GRAH-vis',
    category: 'Neurological',
    aliases: ['mg', 'myasthenic crisis', 'cholinergic crisis', 'acetylcholine receptor'],
    overview:
      'An autoimmune neuromuscular junction disorder causing fluctuating, fatigable skeletal muscle weakness. Weakness worsens with repeated muscle use and typically improves after rest, though acute respiratory muscle failure can develop rapidly.',
    causesAndPathophysiology: [
      'Autoantibodies: IgG antibodies attack or block postsynaptic acetylcholine receptors (AChR) or MuSK proteins at the neuromuscular junction.',
      'Impaired Transmission: Reduced receptor availability means repetitive nerve firing fails to trigger sustained muscle contraction.',
      'Thymus Link: Associated with thymic hyperplasia or thymoma in a significant proportion of UK patients.',
      'Crisis Triggers: Infection, surgery, pregnancy, stress, or contraindicated medicines (such as gentamicin, beta-blockers, or magnesium) can trigger acute decompensation.',
    ],
    symptomsAndBaseline: [
      'Ocular Signs: Asymmetric drooping eyelids (ptosis) and double vision (diplopia), often worse late in the day.',
      'Bulbar Weakness: Nasal speech, difficulty chewing, dysphagia, and risk of choking.',
      'Fatigable Limbs: Proximal arm/neck weakness (dropped head) that worsens with sustained effort.',
      'Normal Sensation: Deep tendon reflexes, pupils, and skin sensation remain intact.',
    ],
    treatments: [
      'Symptomatic Relief: Acetylcholinesterase inhibitors such as pyridostigmine boost acetylcholine at the junction.',
      'Immunosuppression: Prednisolone, azathioprine, mycophenolate mofetil, or ciclosporin.',
      'Acute Rescue: Hospital IV immunoglobulin (IVIG) or plasma exchange during a myasthenic crisis.',
    ],
    commonMeds: ['Pyridostigmine', 'Prednisolone', 'Azathioprine', 'Mycophenolate mofetil'],
    paramedicTakeaways: [
      'Myasthenic Crisis Red Flag: Rising respiratory rate, weak cough, inability to count to 20 in one breath, or bulbar pooling signals imminent ventilatory collapse—SpO₂ stays normal until late.',
      'Airway & NIV: Avoid waiting for hypoxia before hospital pre-alert; patients may deteriorate suddenly and require urgent airway support.',
      'Drug Caution: Check JRCALC/hospital guidance carefully—medications such as magnesium sulfate or beta-blockers can worsen neuromuscular blockade.',
      'Cholinergic vs Myasthenic: Excess pyridostigmine causes SLUDGE cholinergic signs (salivation, bradycardia, sweating), whereas under-dosing causes dry crisis.',
    ],
  },
  {
    id: 'guillain-barre-syndrome',
    title: 'Guillain-Barré Syndrome',
    phoneticSpelling: 'gee-YAN ba-RAY SIN-drohm',
    category: 'Neurological',
    aliases: ['gbs', 'guillain barre', 'miller fisher', 'aidp', 'ascending paralysis'],
    overview:
      'A rare, rapidly evolving post-infectious autoimmune polyneuropathy attacking peripheral nerves. It classically causes symmetrical ascending weakness and loss of reflexes, and can progress within hours to life-threatening respiratory and autonomic failure.',
    causesAndPathophysiology: [
      'Molecular Mimicry: Preceding viral or bacterial infection (often Campylobacter jejuni, CMV, or respiratory illness) triggers cross-reactive antibodies.',
      'Demyelination: Immune attack strips myelin sheaths (or axons) from peripheral motor, sensory, and autonomic nerves.',
      'Conduction Block: Slowed or blocked nerve impulses cause flaccid paralysis and absent deep tendon reflexes.',
      'Autonomic Instability: Vagal and sympathetic nerve involvement produces erratic heart rate and blood pressure swings.',
    ],
    symptomsAndBaseline: [
      'Ascending Weakness: Symmetrical weakness starting in the legs ("heavy legs", trouble climbing stairs) and spreading upwards.',
      'Sensory Paraesthesia: Early tingling or numbness in fingers and toes, plus deep neuropathic back or leg pain.',
      'Areflexia: Reduced or absent knee and ankle reflexes.',
      'Bulbar & Facial Signs: Bilateral facial droop, swallowing difficulty, or ophthalmoplegia (Miller Fisher variant).',
    ],
    treatments: [
      'Immunotherapy: Intravenous immunoglobulin (IVIG) or plasma exchange given urgently in hospital.',
      'Supportive Care: Serial respiratory monitoring (forced vital capacity) and ITU ventilation if diaphragmatic weakness develops.',
      'Pain & VTE Prevention: Neuropathic analgesia (gabapentin/amitriptyline) and thromboprophylaxis.',
    ],
    commonMeds: ['Gabapentin', 'Pregabalin', 'Amitriptyline'],
    paramedicTakeaways: [
      'Rapid Progression: Weakness can ascend from legs to diaphragm within hours—treat any new breathing difficulty, weak voice, or dysphagia as high acuity.',
      'Autonomic Swings: Monitor 3-lead/12-lead ECG and BP closely; severe bradycardias, tachyarrhythmias, or postural drops are common.',
      'Do Not Dismiss as Functional: Early ascending tingling with weak legs after a recent GI or viral illness should always prompt urgent ED assessment.',
    ],
  },
  {
    id: 'multiple-sclerosis',
    title: 'Multiple Sclerosis (MS)',
    phoneticSpelling: 'MUL-tih-pul skleh-ROH-sis',
    category: 'Neurological',
    aliases: ['ms', 'rrms', 'spms', 'ppms', 'optic neuritis', 'uhthoff'],
    overview:
      'A chronic immune-mediated demyelinating condition of the central nervous system (brain, optic nerves, and spinal cord). Patients experience relapsing or progressive neurological deficits depending on where inflammatory plaques form.',
    causesAndPathophysiology: [
      'CNS Demyelination: Autoreactive lymphocytes cross the blood-brain barrier and damage myelin sheaths and oligodendrocytes.',
      'Axonal Injury: Repeated inflammation leaves scarred plaques (sclerosis) and gradual axonal loss.',
      'Heat Sensitivity: Damaged demyelinated axons conduct poorly when core body temperature rises (Uhthoff phenomenon).',
    ],
    symptomsAndBaseline: [
      'Sensory & Visual: Paraesthesia, optic neuritis (painful blurred vision), and Lhermitte sign (electric-shock sensation on neck flexion).',
      'Motor & Balance: Limb weakness, spasticity, ataxia, tremor, and chronic fatigue.',
      'Bladder & Bowel: Urinary urgency, retention, recurrent UTIs, or neurogenic constipation.',
      'Baseline Deficits: Many patients have long-standing asymmetric weakness, walking aids, or suprapubic catheters.',
    ],
    treatments: [
      'Acute Relapses: High-dose oral or IV methylprednisolone once infection is excluded.',
      'Disease-Modifying Therapies: Ocrelizumab, natalizumab, dimethyl fumarate, or fingolimod.',
      'Symptom Management: Baclofen or gabapentin for spasticity and neuropathic pain; oxybutynin for bladder symptoms.',
    ],
    commonMeds: ['Baclofen', 'Gabapentin', 'Prednisolone', 'Methylprednisolone', 'Oxybutynin'],
    paramedicTakeaways: [
      'Pseudo-Relapse vs True Stroke: Fever or infection (especially UTI) commonly triggers temporary worsening of old MS symptoms (Uhthoff phenomenon)—check temp and urine history, but never dismiss acute FAST-positive changes without stroke assessment.',
      'Infection & Sepsis Risk: Patients on potent immunosuppressants or with indwelling catheters are at raised risk of rapid sepsis.',
      'Baseline Comparison: Clarify with the patient or family which focal neurological deficits are old baseline versus brand new today.',
    ],
  },
  {
    id: 'parkinsons-disease',
    title: "Parkinson's Disease",
    phoneticSpelling: 'PAR-kin-sunz dih-ZEEZ',
    category: 'Neurological',
    aliases: ['parkinsonism', 'pd', 'bradykinesia', 'sinemet', 'madopar', 'levodopa'],
    overview:
      "A progressive movement disorder caused by loss of dopamine-producing neurones in the substantia nigra of the midbrain. It causes slow movement, stiffness, tremor, and postural instability alongside autonomic symptoms like postural hypotension.",
    causesAndPathophysiology: [
      'Dopamine Depletion: Degeneration of dopaminergic neurones in the nigrostriatal pathway disrupts smooth motor control.',
      'Lewy Bodies: Abnormal alpha-synuclein protein clumps accumulate inside affected neurones.',
      'Autonomic & Bulbar Spread: Non-motor pathways cause orthostatic hypotension, constipation, dysphagia, and REM sleep disorder.',
    ],
    symptomsAndBaseline: [
      'Motor Triad: Bradykinesia (slow movement), cogwheel/lead-pipe rigidity, and a 4–6 Hz pill-rolling resting tremor.',
      'Gait & Falls: Shuffling, stooped posture, freezing episodes, and poor postural reflexes leading to frequent falls.',
      'On/Off Fluctuations: Mobility changes dramatically depending on exact timing of dopaminergic doses.',
    ],
    treatments: [
      'Levodopa Combinations: Co-careldopa or co-beneldopa are first-line to replenish brain dopamine.',
      'Dopamine Agonists & Adjuncts: Pramipexole, ropinirole, rotigotine skin patches, or rasagiline.',
      'Deep Brain Stimulation: Some patients have implanted chest neurostimulators (DBS).',
    ],
    commonMeds: ['Co-careldopa', 'Co-beneldopa', 'Ropinirole', 'Pramipexole', 'Rasagiline'],
    paramedicTakeaways: [
      'Time-Critical Medication: Missed or delayed Parkinson’s doses cause severe akinesia/rigidity ("freezing") and rare acute neuroleptic-malignant-like crisis—always pack their medication box and note exact dose times for ED handover.',
      'Antiemetic Warning: Avoid dopamine-antagonist antiemetics (metoclopramide, prochlorperazine) as they worsen Parkinsonism; use ondansetron if indicated.',
      'Postural Hypotension: Check lying and standing BP carefully in collapses and falls, as both the disease and levodopa drop BP.',
      'Check for Patches & DBS: Look for transdermal rotigotine patches or a chest DBS generator before placing defibrillator pads or moving forcefully.',
    ],
  },
  {
    id: 'huntingtons-disease',
    title: "Huntington's Disease",
    phoneticSpelling: 'HUN-ting-tunz dih-ZEEZ',
    category: 'Neurological',
    aliases: ['hd', 'huntington chorea', 'chorea', 'cag repeat'],
    overview:
      "An inherited autosomal dominant neurodegenerative disorder causing progressive involuntary movements (chorea), cognitive decline, and psychiatric changes. Paramedics commonly attend for falls, aspiration, behavioural crises, or head injuries.",
    causesAndPathophysiology: [
      'Genetic Mutation: Expanded CAG trinucleotide repeat in the HTT gene on chromosome 4 produces toxic mutant huntingtin protein.',
      'Basal Ganglia Loss: Progressive atrophy of the striatum (caudate and putamen) and cerebral cortex disrupts movement inhibition and executive function.',
    ],
    symptomsAndBaseline: [
      'Chorea & Dystonia: Dance-like involuntary jerky movements, progressing to rigidity and severe balance loss.',
      'Dysphagia & Weight Loss: Poor swallow coordination causing high choking risk and cachexia.',
      'Neuropsychiatric: Irritability, depression, impulsivity, and cognitive slowing.',
    ],
    treatments: [
      'Chorea Control: Tetrabenazine, risperidone, or olanzapine to dampen excessive involuntary movements.',
      'Mood & Behaviour: SSRIs (sertraline, citalopram) or mood stabilisers.',
      'MDT Support: Speech and language therapy, dietetics (PEG feeding later on), and advance care planning.',
    ],
    commonMeds: ['Tetrabenazine', 'Risperidone', 'Olanzapine', 'Sertraline'],
    paramedicTakeaways: [
      'Choking & Silent Aspiration: Food or fluid aspiration is a leading cause of emergency deterioration and respiratory sepsis.',
      'High Trauma Risk: Involuntary movements make falls and occult head injuries common—assess carefully for subdural haematoma if taking anticoagulants.',
      'Calm Scene Approach: Reduce sensory overload and allow extra time for comprehension; chorea worsens noticeably with anxiety or pain.',
    ],
  },
  {
    id: 'spinal-cord-autonomic-dysreflexia',
    title: 'Spinal Cord Injury & Autonomic Dysreflexia',
    phoneticSpelling: 'SPY-nul kord IN-juh-ree & aw-toh-NOM-ik dis-ree-FLEK-see-uh',
    category: 'Neurological',
    aliases: ['sci', 'autonomic dysreflexia', 'ad', 'paraplegia', 'tetraplegia', 'quadriplegia'],
    overview:
      'Patients with a spinal cord injury at or above T6 can suffer Autonomic Dysreflexia—a medical emergency where a painful or irritating stimulus below the injury (most often a blocked urinary catheter or faecal impaction) triggers life-threatening hypertension.',
    causesAndPathophysiology: [
      'Unchecked Sympathetic Surge: A noxious stimulus below the lesion triggers massive sympathetic vasoconstriction below T6.',
      'Failed Descending Control: Brainstem baroreceptors detect soaring BP and slow the heart via the vagus nerve, but inhibitory signals cannot cross the spinal cord lesion to dilate lower-body vessels.',
    ],
    symptomsAndBaseline: [
      'Sudden Severe Hypertension: Dramatic BP rise above the patient’s low normal baseline (e.g. baseline 90/60 spiking to >160–200 mmHg systolic).',
      'Above vs Below Injury: Pounding headache, flushing, nasal congestion, and sweating ABOVE the lesion; pale, cold, goosebumped skin BELOW it.',
      'Heart Rate Clue: Reflex bradycardia (sometimes tachycardia) alongside anxiety and blurred vision.',
    ],
    treatments: [
      'Immediate Trigger Removal: Sit patient upright, loosen tight clothing/straps, and check/flush/unblock urinary catheter or bowel.',
      'Vasodilators: Sublingual GTN or oral nifedipine under clinical guidance if systolic BP stays dangerously high.',
    ],
    commonMeds: ['Glyceryl trinitrate', 'Baclofen', 'Oxybutynin', 'Solifenacin'],
    paramedicTakeaways: [
      'Normal BP Trap: Many T6+ quadriplegic/paraplegic patients run a resting BP of 90/60 mmHg—a reading of 140/90 with a pounding headache IS hypertensive crisis.',
      'Sit Upright First: Lowering legs and sitting the patient upright immediately drops BP via orthostatic pooling; never lay them flat.',
      'Check the Catheter & Skin: Kinked catheter tubing, full leg bag, tight belt, or pressure ulcer is usually the culprit—fixing the trigger rapidly resolves the crisis.',
    ],
  },

  // =========================================================================
  // 2. CARDIOVASCULAR (4)
  // =========================================================================
  {
    id: 'chronic-heart-failure',
    title: 'Chronic Heart Failure',
    phoneticSpelling: 'KRON-ik hart FAYL-yer',
    category: 'Cardiovascular',
    aliases: ['hf', 'chf', 'ccf', 'hfref', 'hfpef', 'lvf', 'heart failure', 'oedema'],
    overview:
      'A clinical syndrome where the heart cannot pump enough blood to meet metabolic demands without elevated filling pressures. Patients live on a fine fluid balance and commonly present with acute decompensation (pulmonary oedema or fluid overload).',
    causesAndPathophysiology: [
      'Pump Dysfunction: Commonly caused by prior myocardial infarction (ischaemic heart disease), hypertension, valve disease, or cardiomyopathy.',
      'Fluid Retention: Reduced cardiac output activates the RAAS and sympathetic nervous systems, retaining salt and water and increasing afterload.',
      'Congestion: Back-pressure raises pulmonary venous pressure (flash/acute pulmonary oedema) and systemic venous pressure (ankle/sacral oedema, ascites).',
    ],
    symptomsAndBaseline: [
      'Baseline Breathlessness: Exertional dyspnoea, orthopnoea (sleeping on multiple pillows), and paroxysmal nocturnal dyspnoea (PND).',
      'Congestion Signs: Bibasal fine crepitations, elevated JVP, and bilateral pitting ankle or sacral oedema.',
      'Low Baseline Obs: Often hypotensive at baseline due to quadruple heart failure therapy.',
    ],
    treatments: [
      'Four-Pillar Therapy: ACEi/ARB or sacubitril-valsartan (Entresto), beta-blocker (bisoprolol), MRA (spironolactone), and SGLT2 inhibitor (dapagliflozin).',
      'Fluid Offloading: Loop diuretics such as furosemide or bumetanide.',
      'Devices: Many patients have pacemakers, CRT-D, or ICDs.',
    ],
    commonMeds: ['Furosemide', 'Bisoprolol', 'Ramipril', 'Dapagliflozin', 'Spironolactone'],
    paramedicTakeaways: [
      'Positioning & O₂: Sit patients upright with legs dependent during acute LVF; give controlled oxygen/CPAP and GTN per JRCALC if BP allows.',
      'Judicious IV Fluids: Avoid aggressive IV fluid boluses unless clear hypovolaemia/sepsis—small, reassessed aliquots prevent worsening pulmonary oedema.',
      'Beta-Blocker Masking: Rate-limiting drugs (bisoprolol) can blunt compensatory tachycardia during sepsis or haemorrhage.',
      'Check for Devices: Look for ICD/CRT scars and check if implantable defibrillator shock alarms or recent therapies occurred.',
    ],
  },
  {
    id: 'postural-tachycardia-syndrome',
    title: 'Postural Tachycardia Syndrome (PoTS)',
    phoneticSpelling: 'POS-tyoo-rul tak-ih-KAR-dee-uh SIN-drohm',
    category: 'Cardiovascular',
    aliases: ['pots', 'postural orthostatic tachycardia syndrome', 'dysautonomia'],
    overview:
      'An abnormality of the autonomic nervous system characterised by a sustained heart rate rise of ≥30 bpm (≥40 bpm in teenagers) within 10 minutes of standing, without significant orthostatic hypotension. Commonly overlaps with Ehlers-Danlos syndrome and post-viral fatigue.',
    causesAndPathophysiology: [
      'Venous Pooling: Impaired peripheral vasoconstriction causes blood to pool in the lower limbs and abdomen upon standing.',
      'Reflex Sympathetic Surge: Baroreceptors trigger excessive noradrenaline release and tachycardia to maintain cerebral perfusion despite falling venous return.',
    ],
    symptomsAndBaseline: [
      'Orthostatic Intolerance: Palpitations, presyncope, lightheadedness, and tremor triggered rapidly by standing, hot showers, or meals.',
      'Syncope: Occasional vasovagal fainting, with prompt recovery once flat.',
      'Systemic Fatigue: Brain fog, nausea, purple/mottled lower legs (acrocyanosis) when upright.',
    ],
    treatments: [
      'Conservative Measures: High oral fluid/electrolyte intake (unless contraindicated), compression hosiery, and gradual recumbent exercise.',
      'Rate & Tone Meds: Ivabradine, propranolol/bisoprolol, midodrine (vasoconstrictor), or fludrocortisone.',
    ],
    commonMeds: ['Ivabradine', 'Propranolol', 'Midodrine', 'Fludrocortisone'],
    paramedicTakeaways: [
      'Lying vs Standing Obs: Classic PoTS shows normal BP and HR when supine, surging steeply on sitting/standing—do not misinterpret isolated standing sinus tachycardia as cardiac arrhythmia.',
      'Lay Flat for Presyncope: Supine positioning with legs slightly raised restores venous return quickly.',
      'Do Not Over-Medicalise Baseline: Always still run a 12-lead ECG and rule out PE, sepsis, anaemia, or acute SVT before attributing tachycardia solely to PoTS.',
    ],
  },
  {
    id: 'pulmonary-hypertension',
    title: 'Pulmonary Hypertension',
    phoneticSpelling: 'PUL-muh-nuh-ree hy-per-TEN-shun',
    category: 'Cardiovascular',
    aliases: ['ph', 'pah', 'cteph', 'cor pulmonale', 'right heart failure'],
    overview:
      'High blood pressure inside the pulmonary arteries supplying the lungs, forcing the right ventricle to pump against high resistance. Over time the right heart dilates and fails, making patients extremely fragile to hypoxia, hypotension, or fluid shifts.',
    causesAndPathophysiology: [
      'Pulmonary Vascular Remodelling: Narrowed, stiffened pulmonary arterioles increase pulmonary vascular resistance.',
      'Subtypes: Can be idiopathic PAH, secondary to left heart failure, chronic lung disease (COPD/ILD), or chronic thromboembolic disease (CTEPH).',
      'Right Ventricular Strain: Rising afterload causes right ventricular hypertrophy and eventually right heart failure.',
    ],
    symptomsAndBaseline: [
      'Progressive Dyspnoea: Severe shortness of breath on minimal exertion.',
      'Right Heart Signs: Raised JVP, ankle oedema, hepatomegaly, and exertional chest pain.',
      'Syncope Red Flag: Fainting on mild exertion signals critically limited cardiac output.',
    ],
    treatments: [
      'Pulmonary Vasodilators: Sildenafil, tadalafil, bosentan, ambrisentan, or continuous IV/SC prostacyclin pumps (epoprostenol/treprostinil).',
      'Anticoagulation & O₂: Warfarin or DOACs (especially CTEPH) and long-term home oxygen.',
    ],
    commonMeds: ['Sildenafil', 'Bosentan', 'Warfarin', 'Furosemide', 'Spironolactone'],
    paramedicTakeaways: [
      'Hypoxia Causes Vasoconstriction: Even brief hypoxia spikes pulmonary pressures and can precipitate right ventricular arrest—keep SpO₂ well maintained.',
      'Continuous Infusion Pumps: NEVER stop or disconnect a patient’s Hickman-line epoprostenol/treprostinil pump; interruption causes fatal rebound pulmonary crisis within minutes.',
      'Fluid & Vasodilator Caution: Large fluid boluses over-distend the failing right ventricle, while aggressive GTN can crash systemic BP and coronary perfusion.',
    ],
  },
  {
    id: 'atrial-fibrillation',
    title: 'Atrial Fibrillation (AF)',
    phoneticSpelling: 'AY-tree-ul fib-rih-LAY-shun',
    category: 'Cardiovascular',
    aliases: ['af', 'afib', 'paf', 'fast af', 'rvr', 'anticoagulated'],
    overview:
      'The most common sustained cardiac arrhythmia in the UK, caused by disorganised electrical firing across the atria. Rather than contracting smoothly, the atria quiver, producing an irregularly irregular ventricular pulse and stasis that risks stroke clots.',
    causesAndPathophysiology: [
      'Chaotic Atrial Firing: Ectopic triggers (often near the pulmonary veins) fire rapidly, conducting unpredictably through the AV node.',
      'Loss of Atrial Kick: Reduces ventricular filling by ~20%, which can trigger dyspnoea or hypotension at fast rates.',
      'Thromboembolism: Stagnant blood in the left atrial appendage forms clots that embolise to the brain (ischaemic stroke).',
    ],
    symptomsAndBaseline: [
      'Irregular Pulse: Characteristically irregularly irregular pulse with absent P waves on 12-lead ECG.',
      'Paroxysmal vs Permanent: Many elderly UK patients live in chronic controlled AF (HR 60–90 bpm) with no symptoms.',
      'Fast AF Triggers: Sepsis, dehydration, hypoxia, PE, or alcohol commonly drive pre-existing AF into fast AF.',
    ],
    treatments: [
      'Rate Control: Bisoprolol, diltiazem, or digoxin.',
      'Rhythm Control: Amiodarone, flecainide, or catheter ablation.',
      'Stroke Prevention: DOACs (apixaban, rivaroxaban, edoxaban, dabigatran) or warfarin.',
    ],
    commonMeds: ['Apixaban', 'Rivaroxaban', 'Bisoprolol', 'Digoxin', 'Amiodarone'],
    paramedicTakeaways: [
      'Treat the Driver, Not Just the ECG: New fast AF (>120–150 bpm) is frequently driven by sepsis, hypoxia, hypovolaemia, or pain—correcting the cause often settles the rate.',
      'Major Bleeding Risk: Almost all AF patients take anticoagulants—even a minor head bump or fall requires strict head-injury trauma questioning and lower conveyance threshold.',
      'Known vs New Onset: Ask whether AF is longstanding baseline or brand new, and check for red flags (chest pain, LVF, SBP <90, syncope).',
    ],
  },

  // =========================================================================
  // 3. RESPIRATORY (4)
  // =========================================================================
  {
    id: 'copd',
    title: 'Chronic Obstructive Pulmonary Disease (COPD)',
    phoneticSpelling: 'KRON-ik ob-STRUK-tiv PUL-muh-nuh-ree dih-ZEEZ',
    category: 'Respiratory',
    aliases: ['copd', 'emphysema', 'chronic bronchitis', 'co2 retainer', 'gold'],
    overview:
      'A progressive, largely irreversible airflow limitation encompassing chronic bronchitis (airway inflammation and mucus) and emphysema (alveolar wall destruction). Infective exacerbations and Type 2 respiratory failure are among the top 999 respiratory call-outs.',
    causesAndPathophysiology: [
      'Airway & Alveolar Damage: Primarily caused by smoking or occupational dust/fume exposure causing chronic inflammation and loss of elastic recoil.',
      'Air Trapping: Small airways collapse early on expiration, hyperinflating the lungs and flattening the diaphragm.',
      'V/Q Mismatch & CO₂ Retention: Severe disease impairs gas exchange, causing chronic hypoxaemia and compensatory hypercapnia in a subset of patients.',
    ],
    symptomsAndBaseline: [
      'Chronic Baseline: Daily productive cough, exertional breathlessness, barrel chest, and pursed-lip breathing.',
      'Resting SpO₂: Many patients sit comfortably at 88–92% at baseline and hold NHS Oxygen Alert Cards.',
      'Exacerbation Signs: Increased sputum volume/purulence, worsening wheeze, accessory muscle use, or drowsiness (CO₂ narcosis).',
    ],
    treatments: [
      'Inhalers: Short-acting relief (salbutamol/ipratropium) plus long-acting triple therapy (LABA + LAMA + ICS, e.g. Trimbow/Trelegy).',
      'Rescue Packs: Home standby prednisolone and oral antibiotics (doxycycline/amoxicillin).',
      'Home Support: Long-term oxygen therapy (LTOT) or domiciliary NIV.',
    ],
    commonMeds: ['Salbutamol', 'Ipratropium bromide', 'Tiotropium', 'Prednisolone', 'Carbocisteine'],
    paramedicTakeaways: [
      'Target SpO₂ 88–92%: Avoid excessive high-flow oxygen once stabilised, as hyperoxia worsens V/Q mismatch (Haldane effect) and hypercapnic acidosis.',
      'Nebuliser Air vs O₂: If driving nebulisers with oxygen, limit to ~6 mins per JRCALC or switch to compressed air once nebulised if chronic CO₂ retainer.',
      'Red Flags for NIV/ITU: Drowsiness, flapping tremor (asterixis), exhaustion, silent chest, or confusion indicates worsening hypercapnia requiring urgent pre-alert.',
    ],
  },
  {
    id: 'cystic-fibrosis',
    title: 'Cystic Fibrosis (CF)',
    phoneticSpelling: 'SIS-tik fy-BROH-sis',
    category: 'Respiratory',
    aliases: ['cf', 'cftr', 'kaftrio', 'mucoviscidosis'],
    overview:
      'An autosomal recessive multi-system condition caused by defective chloride ion transport across epithelial cells. Thick, sticky mucus clogs the airways, pancreatic ducts, and gut, causing recurrent lung infections, bronchiectasis, and malabsorption.',
    causesAndPathophysiology: [
      'CFTR Mutation: Defective CFTR protein stops chloride and water moving into airway and duct secretions.',
      'Mucus Stasis: Dehydrated, viscous airway mucus impairs mucociliary clearance and traps bacteria (e.g. Pseudomonas aeruginosa).',
      'Pancreatic Insufficiency: Blocked pancreatic ducts destroy exocrine enzymes and islet cells, leading to CF-related diabetes.',
    ],
    symptomsAndBaseline: [
      'Respiratory Baseline: Daily wet cough, crackles/wheeze, finger clubbing, and baseline dyspnoea; haemoptysis or pneumothorax can occur acutely.',
      'Extrapulmonary: Pancreatic insufficiency (Creon enzymes with meals), steatorrhoea, CF-related diabetes, and liver disease.',
      'Ports & Lines: Many adults have an implanted chest Port-a-Cath for regular IV antibiotics.',
    ],
    treatments: [
      'CFTR Modulators: Kaftrio (ivacaftor/tezacaftor/elexacaftor) dramatically improves lung function in eligible genotypes.',
      'Airway Clearance: Nebulised dornase alfa, hypertonic saline, physiotherapy, and targeted antipseudomonal antibiotics.',
      'Nutrition: Pancreatic enzyme replacement (pancreatin/Creon) and insulin for CF-related diabetes.',
    ],
    commonMeds: ['Dornase alfa', 'Salbutamol', 'Azithromycin', 'Insulin', 'Pancreatin'],
    paramedicTakeaways: [
      'Haemoptysis & Pneumothorax: Sudden pleuritic chest pain or fresh blood-streaked sputum warrants urgent hospital assessment—major haemoptysis is a life-threatening emergency.',
      'Electrolyte & Dehydration Risk: CF patients lose excessive salt in sweat; dehydration and hyponatraemia develop rapidly in fever or hot weather.',
      'Expert Patients: Most CF adults know their exact baseline SpO₂, target oxygen range, and specialist CF hospital team—listen closely to them and contact their specialist centre if protocol allows.',
    ],
  },
  {
    id: 'bronchiectasis',
    title: 'Bronchiectasis',
    phoneticSpelling: 'brong-kee-EK-tuh-sis',
    category: 'Respiratory',
    aliases: ['bronchiectatic', 'chronic sputum', 'pseudomonas'],
    overview:
      'Permanent, abnormal widening and scarring of the bronchi caused by a cycle of airway inflammation and chronic bacterial infection. Damaged airways pool thick sputum, predisposing patients to repeated chest infections and haemoptysis.',
    causesAndPathophysiology: [
      'Vicious Vortex: Severe prior pneumonia, TB, ABPA, immunodeficiency, or COPD damages bronchial walls and cilia.',
      'Pooling Secretions: Floppy, dilated airways trap mucus, encouraging chronic bacterial colonisation and further wall destruction.',
    ],
    symptomsAndBaseline: [
      'Chronic Cough: Daily mucopurulent sputum production, often worst on waking.',
      'Auscultation: Coarse inspiratory/expiratory crackles and scattered wheeze even when well.',
      'Exacerbation: Increased sputum thickness/volume, pleuritic pain, fever, or coughing up small amounts of blood.',
    ],
    treatments: [
      'Airway Clearance: Daily chest physiotherapy techniques, Acapella/Flutter devices, and carbocisteine.',
      'Targeted Antibiotics: Standby 14-day courses or long-term prophylactic azithromycin / nebulised colistimethate.',
      'Bronchodilators: Salbutamol or tiotropium if reversible airflow obstruction coexists.',
    ],
    commonMeds: ['Carbocisteine', 'Azithromycin', 'Salbutamol', 'Amoxicillin'],
    paramedicTakeaways: [
      'Do Not Confuse Crackles with LVF: Coarse basal crackles are normal baseline for bronchiectasis—compare with oedema, JVP, and fever before assuming fluid overload.',
      'Check Sputum & Haemoptysis: Large-volume frank haemoptysis (>100 ml/24h or ongoing fresh blood) requires urgent ED pre-alert and positioning affected lung down if side is known.',
      'Oxygen Titration: Some severe bronchiectasis patients also retain CO₂—check for an Oxygen Alert Card and monitor closely.',
    ],
  },
  {
    id: 'interstitial-lung-disease',
    title: 'Interstitial Lung Disease (Pulmonary Fibrosis)',
    phoneticSpelling: 'in-ter-STISH-ul lung dih-ZEEZ',
    category: 'Respiratory',
    aliases: ['ild', 'ipf', 'pulmonary fibrosis', 'fibrosing alveolitis'],
    overview:
      'A group of chronic disorders (most notably Idiopathic Pulmonary Fibrosis) causing progressive scarring and stiffening of the lung interstitium around the alveoli. Stiff lungs severely limit oxygen diffusion, causing rapid desaturation on minimal exertion.',
    causesAndPathophysiology: [
      'Alveolar Scarring: Repeated alveolar epithelial injury (idiopathic, connective tissue disease, amiodarone/methotrexate toxicity, or asbestos/bird-fancier exposure) triggers excessive collagen deposition.',
      'Diffusion Barrier: Thickened alveolar walls and stiff, shrunken lungs impair oxygen transfer (restrictive lung defect).',
    ],
    symptomsAndBaseline: [
      'Clinical Signs: Dry non-productive cough, finger clubbing, and classic fine "Velcro-like" end-inspiratory basal crackles.',
      'Exertional Desaturation: Resting SpO₂ may look acceptable, then plummet rapidly when walking a few steps.',
      'Home Oxygen: Many patients use ambulatory or continuous home oxygen cylinders/concentrators.',
    ],
    treatments: [
      'Antifibrotics: Pirfenidone or nintedanib to slow progression in IPF.',
      'Immunosuppression: Prednisolone or mycophenolate in inflammatory/connective-tissue ILD.',
      'Supportive: Long-term oxygen therapy, pulmonary rehabilitation, and palliative opiates for severe dyspnoea.',
    ],
    commonMeds: ['Nintedanib', 'Pirfenidone', 'Prednisolone', 'Mycophenolate mofetil', 'Morphine'],
    paramedicTakeaways: [
      'Extreme Exertional Hypoxia: Do NOT walk an ILD patient to the ambulance—bring the carry chair/trolley to them, as standing or walking can drop SpO₂ into the 60s–70s within seconds.',
      'Not Usually CO₂ Retainers: Unlike COPD, pure pulmonary fibrosis causes Type 1 (hypoxaemic) failure—give oxygen promptly to correct severe hypoxaemia.',
      'Check Advance Care Plans: End-stage ILD carries high mortality; check for ReSPECT/palliative plans and community respiratory team details.',
    ],
  },

  // =========================================================================
  // 4. ENDOCRINE & METABOLIC (4)
  // =========================================================================
  {
    id: 'addisons-disease',
    title: "Addison's Disease (Adrenal Insufficiency)",
    phoneticSpelling: 'AD-ih-sunz dih-ZEEZ',
    category: 'Endocrine & Metabolic',
    aliases: [
      'addison',
      'adrenal insufficiency',
      'adrenal crisis',
      'addisonian crisis',
      'hypoadrenalism',
      'steroid dependent',
    ],
    overview:
      'Primary adrenal insufficiency in which damaged adrenal glands fail to produce enough cortisol (and usually aldosterone). During infection, trauma, or vomiting, patients cannot mount a stress cortisol response and rapidly fall into fatal Addisonian (adrenal) crisis.',
    causesAndPathophysiology: [
      'Adrenal Cortex Loss: Most UK cases are autoimmune destruction of the adrenal cortex; secondary insufficiency stems from pituitary disease or abrupt long-term steroid withdrawal.',
      'Hormone Deficit: Lack of cortisol impairs vascular catecholamine tone and glucose maintenance; lack of aldosterone causes renal sodium/water wasting and potassium retention.',
      'Crisis Cascade: Stress without extra hydrocortisone triggers profound distributive/hypovolaemic shock resistant to fluids alone.',
    ],
    symptomsAndBaseline: [
      'Chronic Features: Fatigue, weight loss, salt craving, postural dizziness, and bronze skin hyperpigmentation (palmar creases, gums).',
      'Adrenal Crisis: Severe hypotension/shock, persistent vomiting, abdominal or back pain, confusion, and hypoglycaemia.',
      'Patient Alerts: Patients carry a blue/red NHS Steroid Emergency Card and often an emergency IM hydrocortisone kit.',
    ],
    treatments: [
      'Daily Replacement: Oral hydrocortisone (cortisol) plus fludrocortisone (aldosterone replacement).',
      'Sick-Day Rules: Doubling oral hydrocortisone during minor illness/fever.',
      'Emergency Crisis Care: Immediate IM or IV hydrocortisone 100 mg plus rapid 0.9% sodium chloride infusion.',
    ],
    commonMeds: ['Hydrocortisone', 'Fludrocortisone', 'Prednisolone'],
    paramedicTakeaways: [
      'Steroid Before Everything in Crisis: Hypotension + vomiting/illness in a steroid-dependent patient is an adrenal crisis until proven otherwise—give 100 mg IM/IV hydrocortisone immediately per JRCALC (can use patient’s own kit if needed).',
      'Check BM Immediately: Cortisol deficiency causes severe hypoglycaemia, especially alongside vomiting.',
      'Avoid Delay: Adrenal crisis shock will NOT respond properly to IV fluids alone without hydrocortisone—pre-alert ED.',
    ],
  },
  {
    id: 'type-1-diabetes',
    title: 'Type 1 Diabetes Mellitus',
    phoneticSpelling: 'type WUN dy-uh-BEE-teez MEL-ih-tus',
    category: 'Endocrine & Metabolic',
    aliases: ['t1dm', 'type 1 diabetes', 'iddm', 'dka', 'diabetic ketoacidosis', 'insulin pump'],
    overview:
      'An autoimmune condition causing complete destruction of pancreatic beta cells and absolute insulin deficiency. Patients rely entirely on exogenous insulin, placing them at daily risk of both sudden severe hypoglycaemia and life-threatening Diabetic Ketoacidosis (DKA).',
    causesAndPathophysiology: [
      'Absolute Insulin Loss: Autoimmune T-cell destruction stops insulin production, preventing glucose entering muscle and fat cells.',
      'Lipolysis & Ketones: Without insulin, the body breaks down fat into acidic ketone bodies, driving osmotic diuresis, severe dehydration, and metabolic acidosis (DKA).',
    ],
    symptomsAndBaseline: [
      'Hyperglycaemia / DKA: Polyuria, polydipsia, vomiting, abdominal pain, deep Kussmaul breathing, pear-drop ketotic breath, and tachycardia.',
      'Hypoglycaemia: Sweating, tremor, aggression/confusion, slurred speech, seizures, or coma (BM <4.0 mmol/L).',
      'Wearable Tech: Most UK patients now wear Libre/Dexcom CGM sensors and/or insulin pumps (Omnipod, Tandem, Medtronic).',
    ],
    treatments: [
      'Basal-Bolus Insulin: Long-acting (insulin glargine/degludec) plus rapid-acting mealtime insulin (NovoRapid/Fiasp) or continuous pump.',
      'Hypo Rescue: Rapid oral glucose, IV glucose 10%, or IM glucagon.',
      'DKA Protocol: Hospital IV 0.9% sodium chloride, fixed-rate IV insulin infusion, and potassium monitoring.',
    ],
    commonMeds: ['Insulin aspart', 'Insulin glargine', 'Insulin degludec', 'Glucagon'],
    paramedicTakeaways: [
      'Never Stop Background Insulin Without Reason: In DKA, withholding all insulin worsens ketosis—if an insulin pump is delivering insulin during severe HYPOGLYCAEMIA, suspend/disconnect it, then inform ED.',
      'Verify CGM with Fingerprick BM: Sensors lag behind true blood glucose during rapid swings or poor perfusion—always check a capillary BM.',
      'Euglycaemic DKA Trap: Even T1DM patients with modest glucose (<11 mmol/L, especially if ill or using SGLT2 adjuncts) can still have ketoacidosis—check blood ketones if available and treat vomiting + unwell T1DM seriously.',
    ],
  },
  {
    id: 'diabetes-insipidus',
    title: 'Diabetes Insipidus (AVP Deficiency)',
    phoneticSpelling: 'dy-uh-BEE-teez in-SIP-ih-dus',
    category: 'Endocrine & Metabolic',
    aliases: ['di', 'avp deficiency', 'avp resistance', 'desmopressin', 'cranial di', 'nephrogenic di'],
    overview:
      'A rare hormone disorder (increasingly termed AVP deficiency or resistance) completely unrelated to blood sugar. The kidneys cannot concentrate urine because of missing or ineffective antidiuretic hormone (vasopressin), causing extreme thirst and huge volumes of dilute urine.',
    causesAndPathophysiology: [
      'Cranial (AVP Deficiency): Pituitary surgery, head trauma, tumour, or autoimmune inflammation stops vasopressin release.',
      'Nephrogenic (AVP Resistance): Renal tubules fail to respond to vasopressin (often secondary to long-term lithium therapy).',
      'Hypernatraemic Dehydration: Without fluid replacement or desmopressin, rapid free-water loss causes dangerously high serum sodium.',
    ],
    symptomsAndBaseline: [
      'Extreme Output: Passing 4–20 litres of pale, watery urine daily alongside intense thirst.',
      'Normal Blood Sugar: BM is normal—do not confuse with diabetes mellitus.',
      'Crisis Signs: Lethargy, confusion, dry mucous membranes, tachycardia, and seizures if unable to drink (e.g. vomiting illness).',
    ],
    treatments: [
      'Cranial DI: Desmopressin (DDAVP) nasal spray, oral tablets, or sublingual melts—a time-critical NHS medication.',
      'Nephrogenic DI: Thiazide diuretics, NSAIDs, or stopping/adjusting lithium under specialist care.',
    ],
    commonMeds: ['Desmopressin', 'Bendroflumethiazide', 'Lithium carbonate'],
    paramedicTakeaways: [
      'Do Not Confuse with Diabetes Mellitus: Normal BM does not rule out a serious Diabetes Insipidus emergency; missed desmopressin is fatal if hypernatraemia escalates.',
      'Time-Critical Desmopressin: Ensure patients bring their desmopressin supply to A&E and flag to triage immediately if they have been vomiting or missed doses.',
      'Fluid Caution: Severe hypernatraemia needs careful hospital correction (rapid drops cause cerebral oedema)—resuscitate shock per JRCALC, and clearly document total urine output and thirst.',
    ],
  },
  {
    id: 'phaeochromocytoma',
    title: 'Phaeochromocytoma',
    phoneticSpelling: 'FEE-oh-kroh-moh-sy-TOH-ma',
    category: 'Endocrine & Metabolic',
    aliases: ['pheochromocytoma', 'phaeo', 'pheo', 'paraganglioma', 'adrenal tumour', 'catecholamine'],
    overview:
      'A rare catecholamine-secreting neuroendocrine tumour arising from the adrenal medulla. It discharges unpredictable bursts of adrenaline and noradrenaline into the bloodstream, causing paroxysmal life-threatening hypertension, tachycardia, and cardiomyopathy.',
    causesAndPathophysiology: [
      'Catecholamine Surges: Tumour cells release massive pulses of adrenaline and noradrenaline either spontaneously or when triggered by palpation, stress, anaesthesia, or certain drugs.',
      'Alpha & Beta Overload: Extreme alpha-mediated vasoconstriction spikes BP dangerously while beta stimulation drives tachyarrhythmias.',
    ],
    symptomsAndBaseline: [
      'Classic Triad: Episodic severe throbbing headache, profuse drenching sweats, and pounding palpitations.',
      'Pallor & Panic: Extreme facial pallor (not flushing), tremor, chest tightness, and a sense of impending doom.',
      'Labile BP: Wild blood pressure swings from severe hypertensive crisis to postural hypotension.',
    ],
    treatments: [
      'Pre-Operative Blockade: Alpha-blockers FIRST (phenoxybenzamine or doxazosin) before adding a beta-blocker (propranolol/bisoprolol).',
      'Definitive Cure: Specialist laparoscopic adrenalectomy once safely alpha-blocked.',
    ],
    commonMeds: ['Doxazosin', 'Phenoxybenzamine', 'Propranolol', 'Bisoprolol'],
    paramedicTakeaways: [
      'NEVER Give Beta-Blockers Alone: Unopposed alpha vasoconstriction causes catastrophic hypertensive crisis—flag the diagnosis clearly to ED before any rate-control meds.',
      'Trigger Avoidance: Avoid deep abdominal palpation over the flanks/adrenals and avoid dopamine-antagonist antiemetics like metoclopramide, which can trigger a catecholamine surge.',
      'Stroke & ACS Risk: Treat surges with urgent calm transport, continuous 12-lead monitoring, and immediate ED pre-alert for IV alpha-blockade.',
    ],
  },

  // =========================================================================
  // 5. AUTOIMMUNE & HAEMATOLOGY (5)
  // =========================================================================
  {
    id: 'sickle-cell-disease',
    title: 'Sickle Cell Disease',
    phoneticSpelling: 'SIK-ul sel dih-ZEEZ',
    category: 'Autoimmune & Haematology',
    aliases: ['scd', 'sickle cell', 'sickle crisis', 'vaso-occlusive crisis', 'acute chest syndrome'],
    overview:
      'An inherited haemoglobinopathy causing red blood cells to turn rigid and crescent-shaped under low oxygen, cold, or dehydration. Sickled cells jam inside small blood vessels, causing agonising ischaemic pain crises, organ infarction, and severe infection susceptibility.',
    causesAndPathophysiology: [
      'Haemoglobin S Mutation: Abnormal beta-globin polymerises when deoxygenated, distorting red cells into fragile sickles.',
      'Vaso-Occlusion & Haemolysis: Rigid cells block microvascular flow (bone/lung/spleen ischaemia) and break down early (chronic anaemia).',
      'Functional Asplenia: Repeated splenic infarcts in childhood leave adults highly vulnerable to overwhelming encapsulated bacterial sepsis.',
    ],
    symptomsAndBaseline: [
      'Vaso-Occlusive Crisis: Excruciating deep bone, back, chest, or abdominal pain triggered by cold, infection, stress, or dehydration.',
      'Acute Chest Syndrome: Fever, cough, chest pain, tachypnoea, and falling SpO₂—the leading cause of death in adults with SCD.',
      'Chronic Baseline: Baseline Hb often 70–90 g/L with mild scleral jaundice; many carry NHS Sickle Cell Alert Cards.',
    ],
    treatments: [
      'Crisis Management: Rapid strong analgesia (morphine/oxycodone), warmth, IV/oral hydration, oxygen if hypoxic, and early antibiotics.',
      'Disease Modification: Hydroxycarbamide (hydroxyurea), folic acid, prophylactic phenoxymethylpenicillin, or exchange blood transfusions.',
    ],
    commonMeds: ['Hydroxycarbamide', 'Folic acid', 'Phenoxymethylpenicillin', 'Morphine', 'Paracetamol'],
    paramedicTakeaways: [
      'Treat Pain Immediately: NICE/JRCALC recommend analgesia within 30 minutes—believe the patient’s pain score, give strong analgesia promptly, and never label frequent callers as drug-seeking.',
      'Keep Warm & Hydrated: Cold exposure triggers further sickling—warm the ambulance and avoid cold exposure.',
      'Acute Chest & Stroke Red Flags: Any new chest pain, shortness of breath, fever, or focal neurology requires urgent high-priority ED pre-alert.',
      'Low Baseline Anaemia: Pallor and mild tachycardia can be chronic baseline; give O₂ if SpO₂ <95% or in respiratory distress.',
    ],
  },
  {
    id: 'systemic-lupus-erythematosus',
    title: 'Systemic Lupus Erythematosus (SLE)',
    phoneticSpelling: 'sis-TEM-ik LOO-pus eh-rih-them-uh-TOH-sus',
    category: 'Autoimmune & Haematology',
    aliases: ['sle', 'lupus', 'lupus nephritis', 'malar rash'],
    overview:
      'A relapsing-remitting multisystem autoimmune disease in which immune complexes inflame skin, joints, kidneys, lungs, heart, and blood vessels. Paramedics often see flares, pericarditis/pleurisy, premature cardiovascular events, or sepsis from immunosuppression.',
    causesAndPathophysiology: [
      'Autoantibody Complexes: Antibodies (ANA, anti-dsDNA) bind nuclear antigens, forming immune complexes that deposit in tissues and activate complement.',
      'Vascular & Serosal Inflammation: Causes serositis (pericarditis/pleurisy), lupus nephritis (renal impairment), and accelerated atherosclerosis.',
    ],
    symptomsAndBaseline: [
      'Skin & Joints: Butterfly malar facial rash, photosensitivity, mouth ulcers, and symmetrical migratory joint pain.',
      'Organ Involvement: Pleuritic chest pain, pericardial effusions, frothy urine (nephritis), Raynaud’s phenomenon, or CNS lupus (seizures/psychosis).',
      'Fatigue & Flares: Severe fatigue and low-grade fevers during active flares.',
    ],
    treatments: [
      'Foundation Therapy: Hydroxychloroquine for virtually all SLE patients.',
      'Immunosuppression: Prednisolone, azathioprine, mycophenolate, methotrexate, or rituximab/belimumab.',
    ],
    commonMeds: ['Hydroxychloroquine', 'Prednisolone', 'Mycophenolate mofetil', 'Azathioprine', 'Methotrexate'],
    paramedicTakeaways: [
      'High Sepsis Risk: Immunosuppressed SLE patients with fever may be in neutropenic/opportunistic sepsis rather than "just a flare"—do full sepsis screening.',
      'Steroid Dependency: Check for long-term prednisolone use and NHS Steroid Emergency Cards if unwell, vomiting, or hypotensive.',
      'Premature Cardiac & VTE Risk: Young adults with SLE carry markedly higher risk of MI, pericarditis, PE, and stroke—always obtain a 12-lead ECG for chest pain.',
    ],
  },
  {
    id: 'ehlers-danlos-syndrome',
    title: 'Ehlers-Danlos Syndrome (EDS)',
    phoneticSpelling: 'AY-lerz DAN-los SIN-drohm',
    category: 'Autoimmune & Haematology',
    aliases: ['eds', 'heds', 'veds', 'hypermobility', 'vascular eds'],
    overview:
      'A group of inherited connective tissue disorders affecting collagen structure and strength. While Hypermobile EDS (hEDS) causes recurrent joint dislocations, chronic pain, and dysautonomia (PoTS), Vascular EDS (vEDS) carries life-threatening risk of arterial, aortic, or bowel rupture.',
    causesAndPathophysiology: [
      'Collagen Defect: Genetic variants alter fibrillar collagen or extracellular matrix proteins, making ligaments, skin, and vessel walls overly stretchy or fragile.',
      'Subtype Spectrum: 13 recognised UK subtypes—mostly hEDS (musculoskeletal/autonomic), whereas vEDS (COL3A1 mutation) causes extreme arterial and visceral fragility.',
    ],
    symptomsAndBaseline: [
      'Joint & Skin Signs: Frequent subluxations/dislocations (shoulders, knees, ribs), velvety stretchy skin, and easy bruising.',
      'Overlaps: Frequently coexists with PoTS, MCAS (mast cell activation/allergic reactions), and gastroparesis.',
      'vEDS Red Flags: Sudden severe chest, back, or abdominal pain from spontaneous arterial dissection or organ perforation.',
    ],
    treatments: [
      'Supportive Care: Specialist physiotherapy, joint bracing, multimodal analgesia, and PoTS management.',
      'vEDS Surveillance: Celiprolol in specialist vascular centres to reduce arterial wall stress and strict trauma avoidance.',
    ],
    commonMeds: ['Paracetamol', 'Gabapentin', 'Amitriptyline', 'Ivabradine', 'Cetirizine'],
    paramedicTakeaways: [
      'Ask the Subtype First: Vascular EDS (vEDS) + sudden chest/back/abdominal pain or headache must be treated as potential aortic/arterial dissection or bowel rupture until excluded.',
      'Local Anaesthetic Resistance: Many EDS patients metabolise lidocaine poorly—warn ED if suturing/nerve blocks are planned, and check allergies carefully if they have MCAS.',
      'Gentle Handling: Fragile tissues bruise/tear easily; handle carefully, immobilise suspected dislocations rather than forcing reductions (some hEDS patients safely self-relocate).',
    ],
  },
  {
    id: 'haemophilia',
    title: 'Haemophilia (A & B)',
    phoneticSpelling: 'hee-moh-FIL-ee-uh',
    category: 'Autoimmune & Haematology',
    aliases: ['hemophilia', 'haemophilia a', 'haemophilia b', 'factor viii', 'factor ix', 'bleeding disorder'],
    overview:
      'An inherited X-linked bleeding disorder caused by deficiency of clotting Factor VIII (Haemophilia A) or Factor IX (Haemophilia B). Even minor bumps or falls can cause prolonged internal bleeding into joints (haemarthrosis), muscles, or the brain.',
    causesAndPathophysiology: [
      'Clotting Cascade Defect: Missing Factor VIII or IX prevents stable fibrin clot formation after vessel injury.',
      'Deep Bleeding Pattern: Unlike superficial platelet oozing, haemophilia causes delayed, deep, ongoing bleeding into joints, soft tissues, GI tract, and cranium.',
    ],
    symptomsAndBaseline: [
      'Haemarthrosis: Early tingling/warmth ("aura") before painful swollen knees, ankles, or elbows.',
      'Dangerous Sites: Head trauma, neck/throat swelling (airway compression), and psoas/retroperitoneal bleeds.',
      'Haemophilia Care Cards: Patients hold UK Haemophilia Centre emergency contact cards and often keep factor concentrate at home.',
    ],
    treatments: [
      'Factor Replacement: Prophylactic or emergency IV Factor VIII / Factor IX concentrates, or subcutaneous emicizumab.',
      'Adjunct Clotting: Tranexamic acid for mucosal bleeds (nosebleeds, mouth) and desmopressin (DDAVP) in mild Haemophilia A.',
    ],
    commonMeds: ['Tranexamic acid', 'Desmopressin'],
    paramedicTakeaways: [
      'Treat First, Scan After in ED: "Factor first" is the golden rule—if the patient has home Factor VIII/IX, bring it with them and pre-alert ED + their Haemophilia Centre immediately.',
      'Avoid IM Injections & NSAIDs: Do NOT give intramuscular injections (severe muscle haematoma risk) or ibuprofen/aspirin; use IV/oral/IN routes per JRCALC.',
      'Head & Neck Trauma = Priority 1: Even a trivial head knock or tongue bite requires urgent hospital assessment and factor replacement before symptoms appear.',
    ],
  },
  {
    id: 'antiphospholipid-syndrome',
    title: 'Antiphospholipid Syndrome (APS)',
    phoneticSpelling: 'an-tee-fos-foh-LIP-id SIN-drohm',
    category: 'Autoimmune & Haematology',
    aliases: ['aps', 'hughes syndrome', 'sticky blood', 'thrombophilia'],
    overview:
      'An autoimmune hypercoagulable condition ("sticky blood" / Hughes syndrome) causing recurrent blood clots in veins and arteries, as well as pregnancy complications. Patients often present at younger ages with DVT, PE, TIA, or stroke and usually take lifelong warfarin.',
    causesAndPathophysiology: [
      'Pro-Thrombotic Antibodies: Antiphospholipid antibodies bind cell-membrane proteins, activating platelets, endothelial cells, and the clotting cascade.',
      'Arterial & Venous Clots: Unlike most thrombophilias, APS causes clots in BOTH veins (DVT/PE) and arteries (stroke, MI, splenic/renal infarcts).',
    ],
    symptomsAndBaseline: [
      'Vascular Events: Young-onset stroke/TIA, PE, DVT, or mottled net-like skin rash (livedo reticularis).',
      'Migraine & Visual Aura: Frequent vascular headaches and transient visual disturbance.',
      'Catastrophic APS: Rare life-threatening multi-organ microthrombosis over days.',
    ],
    treatments: [
      'Long-Term Warfarin: Warfarin (usually preferred over DOACs in high-risk/triple-positive APS) or low-molecular-weight heparin in pregnancy.',
      'Antiplatelets & SLE Meds: Low-dose aspirin or hydroxychloroquine if secondary to lupus.',
    ],
    commonMeds: ['Warfarin', 'Aspirin', 'Hydroxychloroquine', 'Enoxaparin'],
    paramedicTakeaways: [
      'Clots Despite Young Age: Never dismiss chest pain, calf swelling, or stroke symptoms in a 20–40-year-old with APS.',
      'Warfarin Bleeding Risk: Because most patients rely on lifelong warfarin (often high INR targets 2.5–3.5), check for head injury, GI bleeding, or epistaxis carefully.',
      'Medication Compliance Check: Ask about recent missed warfarin doses or sub-therapeutic INR readings if presenting with breathlessness or neurological signs.',
    ],
  },

  // =========================================================================
  // 6. GI, HEPATIC & RENAL (4)
  // =========================================================================
  {
    id: 'chronic-kidney-disease',
    title: 'Chronic Kidney Disease & Dialysis (CKD)',
    phoneticSpelling: 'KRON-ik KID-nee dih-ZEEZ',
    category: 'GI, Hepatic & Renal',
    aliases: ['ckd', 'esrf', 'eskd', 'renal failure', 'haemodialysis', 'peritoneal dialysis', 'fistula'],
    overview:
      'Long-term progressive loss of kidney filtering capacity (Stages 1–5), leading to fluid overload, metabolic acidosis, electrolyte imbalances (especially hyperkalaemia), and toxin build-up. Stage 5 patients frequently rely on haemodialysis or peritoneal dialysis.',
    causesAndPathophysiology: [
      'Nephron Loss: Most commonly driven by diabetes, hypertension, glomerulonephritis, or polycystic kidney disease.',
      'Electrolyte & Fluid Failure: Failing kidneys cannot excrete potassium, phosphate, acid, or excess water.',
      'Renal Anaemia & Uraemia: Reduced erythropoietin drops haemoglobin; uraemic toxins irritate pericardium and platelets.',
    ],
    symptomsAndBaseline: [
      'Haemodialysis Access: Look for a palpable/buzzing AV fistula in an arm ("thrill") or a tunnelled chest Tesio/permcath line.',
      'Peritoneal Dialysis: Indwelling abdominal PD catheter.',
      'Uraemic & Overload Signs: Fatigue, pruritus, dyspnoea/fluid overload if dialysis missed, or muscle weakness from hyperkalaemia.',
    ],
    treatments: [
      'Renal Protection: Ramipril/losartan, dapagliflozin, and strict BP control.',
      'Dialysis & Support: 3x-weekly haemodialysis or daily peritoneal dialysis, phosphate binders, vitamin D, and erythropoietin.',
    ],
    commonMeds: ['Ramipril', 'Dapagliflozin', 'Furosemide', 'Folic acid', 'Calcium carbonate'],
    paramedicTakeaways: [
      'Protect the Fistula Arm: NEVER take blood pressure, apply a tourniquet, or cannulate an arm with an AV fistula or graft ("No BP/IV" alert).',
      'Hyperkalaemia ECG Check: Missed dialysis + weakness, chest pain, or bradycardia mandates an urgent 12-lead ECG (peaked T waves, wide QRS, sine wave) and rapid pre-alert.',
      'Fistula Bleeding Emergency: Ruptured AV fistula bleeds under arterial-like pressure—apply direct firm focal fingertip pressure (not bulky loose gauze) and summon urgent backup/pre-alert.',
      'Avoid NSAIDs: Never give ibuprofen or naproxen in CKD.',
    ],
  },
  {
    id: 'liver-cirrhosis',
    title: 'Liver Cirrhosis & Portal Hypertension',
    phoneticSpelling: 'LIV-er sih-ROH-sis',
    category: 'GI, Hepatic & Renal',
    aliases: ['cirrhosis', 'cld', 'chronic liver disease', 'varices', 'ascites', 'hepatic encephalopathy'],
    overview:
      'End-stage liver scarring in which fibrous nodules replace normal hepatic tissue, obstructing portal blood flow (portal hypertension) and impairing detoxification and clotting-factor synthesis. Emergencies include torrential oesophageal variceal bleeding, ascites infection, and hepatic encephalopathy.',
    causesAndPathophysiology: [
      'Fibrotic Remodelling: Chronic alcohol-related liver disease, MASLD (fatty liver), viral hepatitis (B/C), or autoimmune hepatitis scars liver architecture.',
      'Portal Hypertension: High pressure backs up into oesophageal/gastric veins (fragile varices) and pushes fluid into the abdomen (ascites).',
      'Synthetic & Detox Failure: Low albumin worsens oedema; low clotting factors cause coagulopathy; un-cleared ammonia causes encephalopathy.',
    ],
    symptomsAndBaseline: [
      'Stigmata of CLD: Jaundice, spider naevi, palmar erythema, distended abdomen (ascites), and low baseline BP.',
      'Encephalopathy: Altered sleep cycle, confusion, slurred speech, and flapping hand tremor (asterixis).',
      'Variceal Bleed: Sudden large-volume fresh haematemesis or melaena with rapid haemorrhagic shock.',
    ],
    treatments: [
      'Varices Prevention: Carvedilol or propranolol (non-selective beta-blockers) and endoscopic variceal band ligation.',
      'Ascites & Encephalopathy: Spironolactone, furosemide, lactulose, and rifaximin.',
    ],
    commonMeds: ['Spironolactone', 'Furosemide', 'Carvedilol', 'Lactulose', 'Rifaximin'],
    paramedicTakeaways: [
      'Variceal Haematemesis = Major Haemorrhage: Large-bore IV access (2x if possible), cautious permissive hypotension per JRCALC, TXA as indicated locally, and immediate ED pre-alert for blood/terlipressin/endoscopy.',
      'Spontaneous Bacterial Peritonitis (SBP): Any new abdominal pain, fever, or worsening confusion in a patient with ascites can be SBP sepsis—check temperature and convey promptly.',
      'Check BM & Don’t Assume Intoxication: Hepatic encephalopathy and hypoglycaemia look identical to alcohol intoxication—always check BM and assess carefully.',
    ],
  },
  {
    id: 'inflammatory-bowel-disease',
    title: "Crohn's Disease & Ulcerative Colitis (IBD)",
    phoneticSpelling: 'KROHNZ dih-ZEEZ & UL-suh-ruh-tiv koh-LY-tis',
    category: 'GI, Hepatic & Renal',
    aliases: ['ibd', 'crohns', 'crohn disease', 'ulcerative colitis', 'uc', 'stoma', 'toxic megacolon'],
    overview:
      "Chronic relapsing immune-mediated inflammation of the gastrointestinal tract. Ulcerative colitis affects the colon/rectum mucosa continuously causing bloody diarrhoea, whereas Crohn's disease causes patchy full-thickness inflammation anywhere from mouth to anus, often complicated by strictures or fistulae.",
    causesAndPathophysiology: [
      'Dysregulated Gut Immunity: Genetic susceptibility and environmental triggers provoke chronic mucosal/transmural inflammation.',
      'Ulcerative Colitis vs Crohn’s: UC stays superficial in the colon (bloody diarrhoea); Crohn’s penetrates full bowel wall thickness (skip lesions, strictures, abscesses, malabsorption).',
    ],
    symptomsAndBaseline: [
      'Acute Flare: Severe cramping abdominal pain, frequent bloody diarrhoea, fever, dehydration, and tachycardia.',
      'Surgical History: Many patients have an ileostomy or colostomy stoma bag.',
      'Complications: Bowel obstruction/perforation (rigid abdomen, absent sounds) or toxic megacolon.',
    ],
    treatments: [
      'Anti-Inflammatories: Mesalazine (5-ASA) for UC; short courses of prednisolone or budesonide for flares.',
      'Immunosuppressants & Biologics: Azathioprine, methotrexate, infliximab, adalimumab, or ustekinumab.',
    ],
    commonMeds: ['Mesalazine', 'Prednisolone', 'Budesonide', 'Azathioprine', 'Loperamide'],
    paramedicTakeaways: [
      'Severe Flare / Toxic Megacolon: Fever + severe abdominal pain/distension + tachycardia + bloody stools warrants urgent hospital conveyance (risk of perforation).',
      'Stoma Dehydration: High-output ileostomies lose vast fluid and electrolytes rapidly during gastroenteritis—assess hydration and BP carefully.',
      'Steroid & Biologic Risk: Many flare patients take oral steroids or biologics—watch for masked peritonitis, adrenal suppression, and opportunistic sepsis.',
    ],
  },
  {
    id: 'coeliac-disease',
    title: 'Coeliac Disease',
    phoneticSpelling: 'SEE-lee-ak dih-ZEEZ',
    category: 'GI, Hepatic & Renal',
    aliases: ['celiac', 'coeliac', 'gluten intolerance', 'gluten enteropathy'],
    overview:
      'An autoimmune condition in which ingesting gluten (a protein in wheat, barley, and rye) triggers an immune attack on the small intestine lining. Over time it flattens intestinal villi, causing malabsorption, iron/B12 anaemia, and acute accidental-exposure GI flares.',
    causesAndPathophysiology: [
      'Gluten-Triggered Autoimmunity: Gliadin peptides activate mucosal T cells and anti-tTG antibodies in genetically susceptible people (HLA-DQ2/DQ8).',
      'Villous Atrophy: Destruction of small-bowel microvilli dramatically reduces surface area for absorbing iron, folate, calcium, and calories.',
    ],
    symptomsAndBaseline: [
      'Accidental Exposure: Acute cramping abdominal pain, bloating, nausea, diarrhoea, and malaise lasting hours to days after eating gluten.',
      'Chronic Deficiency: Iron-deficiency anaemia, fatigue, osteoporosis, and weight loss.',
      'Autoimmune Overlaps: Frequently associated with Type 1 diabetes and autoimmune thyroid disease.',
    ],
    treatments: [
      'Lifelong Gluten-Free Diet: Strict avoidance of wheat, barley, and rye allows mucosal healing.',
      'Nutritional Replacement: Iron, folic acid, vitamin B12, and calcium/vitamin D supplements if deficient.',
    ],
    commonMeds: ['Ferrous fumarate', 'Folic acid', 'Hydroxocobalamin', 'Colecalciferol'],
    paramedicTakeaways: [
      'Check Excipients / Oral Meds Caution: Although most emergency IV/inhaled drugs are gluten-free, ask before giving non-essential oral snacks/tablets if severe coeliac.',
      'Autoimmune Associations: If a known coeliac patient is acutely unwell, keep Type 1 diabetes (check BM) and Addison’s disease in mind, as autoimmune conditions cluster together.',
      'Don’t Blame Gluten for Red Flags: Severe rigid abdomen, rectal bleeding, or haemodynamic instability needs full surgical/medical workup—coeliac flares don’t cause peritonitis.',
    ],
  },
];
