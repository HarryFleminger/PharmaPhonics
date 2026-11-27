import { ClinicalConditionItem } from '../types/condition';

export const COMMON_CONDITIONS_CATEGORY = 'Common Conditions';

export const COMMON_CONDITION_IDS = [
  'asthma',
  'type-2-diabetes',
  'epilepsy',
  'ischaemic-heart-disease',
  'hypertension',
  'dementia',
  'cerebrovascular-disease',
  'hypothyroidism',
  'gord-peptic-ulcer-disease',
  'rheumatoid-arthritis',
] as const;

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
  COMMON_CONDITIONS_CATEGORY,
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
      'Preserved Cognition: Intellect, awareness, and sensory function typically remain intact despite severe speech impairment.',
      'Home Equipment: Patients frequently use nocturnal or continuous NIV (BiPAP), cough-assist machines, or PEG/RIG feeding tubes.',
    ],
    treatments: [
      'Disease Modification: Riluzole slows progression modestly by reducing glutamate excitotoxicity.',
      'Symptom Control: Baclofen or tizanidine for spasticity; hyoscine, glycopyrronium, or carbocisteine for secretions.',
      'Respiratory Support: Domiciliary NIV (non-invasive ventilation) and mechanical cough-assist devices.',
      'Nutrition & MDT Care: Early gastrostomy (PEG/RIG) tube placement and specialist palliative/neurology ReSPECT care plans.',
    ],
    commonMeds: ['Riluzole', 'Baclofen', 'Hyoscine hydrobromide', 'Glycopyrronium', 'Carbocisteine'],
    acuteComplications: [
      'Hypercapnic Respiratory Failure: Progressive diaphragmatic weakness and chronic CO₂ retention cause acute respiratory acidosis, morning headaches, and somnolence.',
      'Secretion & Mucus Plugging: A weak cough combined with pooled saliva or thick sputum frequently precipitates sudden airway obstruction.',
      'Silent Aspiration Pneumonia: Bulbar dysphagia commonly leads to recurrent lower respiratory tract infections and rapid respiratory decompensation.',
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
      'Crisis Triggers: Infection, surgery, pregnancy, stress, or certain medicines (such as aminoglycosides, beta-blockers, or magnesium) can trigger acute decompensation.',
    ],
    symptomsAndBaseline: [
      'Ocular Signs: Asymmetric drooping eyelids (ptosis) and double vision (diplopia), often worse late in the day.',
      'Bulbar Weakness: Nasal speech, difficulty chewing, dysphagia, and pooling of oral secretions.',
      'Fatigable Limbs: Proximal arm and neck weakness (dropped head) that worsens with sustained effort.',
      'Normal Sensation: Deep tendon reflexes, pupils, and skin sensation remain intact.',
    ],
    treatments: [
      'Symptomatic Relief: Acetylcholinesterase inhibitors such as pyridostigmine boost acetylcholine at the junction.',
      'Immunosuppression: Prednisolone, azathioprine, mycophenolate mofetil, or ciclosporin.',
      'Acute Rescue: Hospital IV immunoglobulin (IVIG) or plasma exchange during a myasthenic crisis.',
    ],
    commonMeds: ['Pyridostigmine', 'Prednisolone', 'Azathioprine', 'Mycophenolate mofetil'],
    acuteComplications: [
      'Myasthenic Crisis: Rapidly worsening bulbar and diaphragmatic weakness leads to acute ventilatory failure and aspiration; pulse oximetry often stays normal until late exhaustion.',
      'Cholinergic Crisis: Overdose of acetylcholinesterase inhibitors (pyridostigmine) produces paradoxical muscle weakness alongside excess salivation, lacrimation, bradycardia, and sweating.',
      'Aspiration & Chest Sepsis: Bulbar dysfunction during a flare frequently precipitates aspiration pneumonitis and secondary respiratory infection.',
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
      'Immunotherapy: Intravenous immunoglobulin (IVIG) or plasma exchange given in hospital.',
      'Supportive Care: Serial respiratory monitoring (forced vital capacity) and ITU ventilation if diaphragmatic weakness develops.',
      'Pain & VTE Prevention: Neuropathic analgesia (gabapentin/amitriptyline) and thromboprophylaxis.',
    ],
    commonMeds: ['Gabapentin', 'Pregabalin', 'Amitriptyline'],
    acuteComplications: [
      'Rapid Respiratory Arrest: Ascending weakness can involve the phrenic nerves and diaphragm within hours, causing silent hypoventilation.',
      'Autonomic Dysfunction: Involvement of cardiac autonomic fibres causes severe labile hypertension, postural hypotension, bradyarrhythmias, or tachyarrhythmias.',
      'Bulbar Palsy & VTE: Impaired swallowing causes aspiration, while acute immobility rapidly elevates risk of DVT and pulmonary embolism.',
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
    acuteComplications: [
      'Uhthoff Pseudo-Relapse: Intercurrent fever, heat exposure, or UTI temporarily blocks conduction in old plaques, mimicking an acute MS relapse or stroke.',
      'Urosepsis & Catheter Sepsis: Neurogenic bladder and indwelling catheters make urinary sepsis a frequent trigger of acute confusion and systemic collapse.',
      'Severe Spasticity & Falls: Acute painful muscle spasms, clonus, or sudden loss of mobility commonly cause falls and injuries.',
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
      'Gait & Falls: Shuffling, stooped posture, freezing episodes, and poor postural reflexes.',
      'On/Off Fluctuations: Mobility changes dramatically depending on exact timing of dopaminergic doses.',
      'Devices & Patches: Some patients wear transdermal rotigotine patches or have an implanted chest deep brain stimulation (DBS) generator.',
    ],
    treatments: [
      'Levodopa Combinations: Co-careldopa or co-beneldopa are first-line to replenish brain dopamine.',
      'Dopamine Agonists & Adjuncts: Pramipexole, ropinirole, rotigotine skin patches, or rasagiline.',
      'Deep Brain Stimulation: Surgical DBS generators or intestinal levodopa-carbidopa gel pumps in advanced disease.',
    ],
    commonMeds: ['Co-careldopa', 'Co-beneldopa', 'Ropinirole', 'Pramipexole', 'Rasagiline'],
    acuteComplications: [
      'Parkinsonism-Hyperpyrexia Syndrome: Sudden withdrawal or missed doses of levodopa can trigger severe rigidity, high fever, autonomic instability, and rhabdomyolysis.',
      'Orthostatic Syncope & Falls: Autonomic failure compounded by dopaminergic therapy causes marked postural blood pressure drops and trauma.',
      'Silent Aspiration & Ileus: Advanced bulbar rigidity leads to aspiration pneumonia, while severe gut hypomotility can progress to pseudo-obstruction.',
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
      'Chorea & Dystonia: Dance-like involuntary jerky movements, progressing to rigidity and severe balance loss in later stages.',
      'Dysphagia & Weight Loss: Poor swallow coordination and high energy expenditure causing cachexia.',
      'Neuropsychiatric: Irritability, depression, impulsivity, and cognitive slowing.',
    ],
    treatments: [
      'Chorea Control: Tetrabenazine, risperidone, or olanzapine to dampen excessive involuntary movements.',
      'Mood & Behaviour: SSRIs (sertraline, citalopram) or mood stabilisers.',
      'MDT Support: Speech and language therapy, dietetics (PEG feeding later on), and advance care planning.',
    ],
    commonMeds: ['Tetrabenazine', 'Risperidone', 'Olanzapine', 'Sertraline'],
    acuteComplications: [
      'Choking & Aspiration Pneumonia: Uncoordinated pharyngeal swallowing makes food airway obstruction and recurrent chest sepsis major emergencies.',
      'Severe Falls & Subdural Bleeding: Pronounced chorea and gait instability cause frequent falls, traumatic head injuries, and subdural haematomas.',
      'Acute Agitation or Delirium: Intercurrent infection, pain, or sensory overload can provoke severe behavioural distress.',
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
      'Low Resting Baseline: Many T6+ patients normally run a resting blood pressure around 90/60 mmHg.',
      'Above vs Below Injury: Autonomic dysreflexia produces pounding headache, flushing, nasal congestion, and sweating ABOVE the lesion; pale, cold, goosebumped skin BELOW it.',
      'Heart Rate Clue: Reflex bradycardia (sometimes tachycardia) alongside anxiety and blurred vision.',
    ],
    treatments: [
      'Trigger Management: Addressing the underlying cause (most often relieving a blocked/kinked urinary catheter or faecal impaction) rapidly lowers pressure.',
      'Postural & Vasodilator Therapy: Upright positioning lowers venous return, and hospital/specialist protocols use fast-acting vasodilators like GTN or nifedipine when severe.',
      'Spasticity & Bladder Meds: Chronic baclofen, oxybutynin, or solifenacin with intermittent or suprapubic catheters.',
    ],
    commonMeds: ['Glyceryl trinitrate', 'Baclofen', 'Oxybutynin', 'Solifenacin'],
    acuteComplications: [
      'Hypertensive Crisis & Haemorrhagic Stroke: A rapid BP rise ≥20–40 mmHg above baseline (e.g. >140–200 mmHg systolic) can cause intracerebral haemorrhage, seizures, or pulmonary oedema.',
      'Common Triggers: Blocked urinary catheter, full bladder, faecal impaction, pressure sores, tight clothing, or ingrown toenails below T6.',
      'Thermal Dysregulation: Loss of sweating and vasomotor control below the lesion predisposes patients to rapid hypothermia or heatstroke.',
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
      'Congestion: Back-pressure raises pulmonary venous pressure (acute pulmonary oedema) and systemic venous pressure (ankle/sacral oedema, ascites).',
    ],
    symptomsAndBaseline: [
      'Baseline Breathlessness: Exertional dyspnoea, orthopnoea (sleeping on multiple pillows), and paroxysmal nocturnal dyspnoea (PND).',
      'Congestion Signs: Bibasal fine crepitations, elevated JVP, and bilateral pitting ankle or sacral oedema.',
      'Low Baseline Obs: Patients often have low resting blood pressure (90s–100s systolic) and blunted heart rate responses due to quadruple therapy.',
    ],
    treatments: [
      'Four-Pillar Therapy: ACEi/ARB or sacubitril-valsartan (Entresto), beta-blocker (bisoprolol), MRA (spironolactone), and SGLT2 inhibitor (dapagliflozin).',
      'Fluid Offloading: Loop diuretics such as furosemide or bumetanide.',
      'Devices: Many patients have implanted pacemakers, CRT-D, or ICDs.',
    ],
    commonMeds: ['Furosemide', 'Bisoprolol', 'Ramipril', 'Dapagliflozin', 'Spironolactone'],
    acuteComplications: [
      'Acute Left Ventricular Failure (LVF): Sudden fluid shift into the alveoli causes pink frothy sputum, severe respiratory distress, hypoxia, and sympathetic panic.',
      'Cardiorenal Decompensation: Over-diuresis or low cardiac output precipitates acute kidney injury, hyperkalaemia, and hypotension.',
      'Ventricular Arrhythmias: Scarred myocardium creates a high substrate for VT/VF and implantable defibrillator (ICD) shocks.',
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
      'Reflex Sympathetic Surge: Baroreceptors trigger excessive noradrenaline release and sinus tachycardia to maintain cerebral perfusion despite falling venous return.',
    ],
    symptomsAndBaseline: [
      'Orthostatic Intolerance: Palpitations, presyncope, lightheadedness, and tremor triggered rapidly by standing, hot showers, or meals.',
      'Syncope: Occasional vasovagal fainting with prompt recovery once supine.',
      'Systemic Fatigue: Brain fog, nausea, and purple/mottled lower legs (acrocyanosis) when upright.',
    ],
    treatments: [
      'Conservative Measures: High oral fluid/electrolyte intake (unless contraindicated), compression hosiery, and gradual recumbent exercise.',
      'Rate & Tone Meds: Ivabradine, propranolol/bisoprolol, midodrine (vasoconstrictor), or fludrocortisone.',
    ],
    commonMeds: ['Ivabradine', 'Propranolol', 'Midodrine', 'Fludrocortisone'],
    acuteComplications: [
      'Orthostatic Presyncope & Syncope: Prolonged standing, heat, fever, or mild dehydration causes abrupt cerebral hypoperfusion, collapse, and potential secondary head trauma.',
      'Autonomic / Adrenaline Surges: Hyperadrenergic PoTS flares produce intense sinus tachycardia (130–160+ bpm), chest tightness, tremor, and severe nausea.',
      'Supine Hypotension Paradox: Vasoconstrictors like midodrine can conversely cause elevated blood pressure when lying completely flat.',
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
      'Continuous Infusion Lines: Specialist PAH patients may carry continuous Hickman-line prostacyclin pumps (epoprostenol/treprostinil).',
    ],
    treatments: [
      'Pulmonary Vasodilators: Sildenafil, tadalafil, bosentan, ambrisentan, or continuous IV/SC prostacyclin infusions.',
      'Anticoagulation & O₂: Warfarin or DOACs (especially CTEPH) and long-term home oxygen.',
    ],
    commonMeds: ['Sildenafil', 'Bosentan', 'Warfarin', 'Furosemide', 'Spironolactone'],
    acuteComplications: [
      'Right Ventricular Crisis & Arrest: Even mild hypoxia causes hypoxic pulmonary vasoconstriction, spiking pulmonary pressures and triggering cardiogenic shock or PEA arrest.',
      'Exertional Syncope: Critical limitation of blood flow across the lungs causes sudden fainting during minor exertion.',
      'Pump Interruption Crisis: Any disconnection or occlusion of a continuous prostacyclin infusion causes life-threatening rebound pulmonary hypertension within minutes.',
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
      'Paroxysmal vs Permanent: Many elderly UK patients live in chronic controlled AF (HR 60–90 bpm) with minimal symptoms.',
      'Rate Variability: Intercurrent sepsis, dehydration, hypoxia, or PE frequently accelerates baseline AF.',
    ],
    treatments: [
      'Rate Control: Bisoprolol, diltiazem, or digoxin.',
      'Rhythm Control: Amiodarone, flecainide, or catheter ablation.',
      'Stroke Prevention: DOACs (apixaban, rivaroxaban, edoxaban, dabigatran) or warfarin.',
    ],
    commonMeds: ['Apixaban', 'Rivaroxaban', 'Bisoprolol', 'Digoxin', 'Amiodarone'],
    acuteComplications: [
      'Uncontrolled Fast AF: Rapid ventricular rates (>130–160 bpm) shorten diastolic filling time, precipitating acute heart failure, chest pain, or hypotension.',
      'Embolic Ischaemic Stroke: Clots dislodging from the left atrium can cause sudden large-vessel strokes or peripheral arterial emboli.',
      'Anticoagulant Haemorrhage: Oral anticoagulation significantly increases the severity of intracranial haemorrhage following falls and major GI bleeding.',
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
      'Exacerbation Signs: Increased sputum volume/purulence, worsening wheeze, and accessory muscle use.',
    ],
    treatments: [
      'Inhalers: Short-acting relief (salbutamol/ipratropium) plus long-acting triple therapy (LABA + LAMA + ICS, e.g. Trimbow/Trelegy).',
      'Rescue Packs: Home standby prednisolone and oral antibiotics (doxycycline/amoxicillin).',
      'Home Support: Long-term oxygen therapy (LTOT) or domiciliary NIV.',
    ],
    commonMeds: ['Salbutamol', 'Ipratropium bromide', 'Tiotropium', 'Prednisolone', 'Carbocisteine'],
    acuteComplications: [
      'Acute Hypercapnic Acidosis: Infective flares or excessive unregulated oxygen therapy worsen V/Q mismatch (Haldane effect), causing CO₂ narcosis, asterixis, drowsiness, and respiratory arrest.',
      'Secondary Pneumothorax: Rupture of emphysematous bullae can cause sudden severe dyspnoea, pleuritic pain, and rapid collapse.',
      'Cor Pulmonale: Chronic pulmonary vasoconstriction leads to right heart strain and peripheral oedema.',
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
      'Respiratory Baseline: Daily wet cough, crackles/wheeze, finger clubbing, and baseline dyspnoea.',
      'Extrapulmonary: Pancreatic insufficiency (Creon enzymes with meals), steatorrhoea, CF-related diabetes, and liver disease.',
      'Ports & Lines: Many adults have an implanted chest Port-a-Cath for regular IV antibiotics and carry specialist CF centre contact details.',
    ],
    treatments: [
      'CFTR Modulators: Kaftrio (ivacaftor/tezacaftor/elexacaftor) dramatically improves lung function in eligible genotypes.',
      'Airway Clearance: Nebulised dornase alfa, hypertonic saline, physiotherapy, and targeted antipseudomonal antibiotics.',
      'Nutrition: Pancreatic enzyme replacement (pancreatin/Creon) and insulin for CF-related diabetes.',
    ],
    commonMeds: ['Dornase alfa', 'Salbutamol', 'Azithromycin', 'Insulin', 'Pancreatin'],
    acuteComplications: [
      'Massive Haemoptysis & Pneumothorax: Eroded hypertrophied bronchial vessels can bleed heavily, while apical bullae risk spontaneous pneumothorax.',
      'Salt-Loss Dehydration: Excessive sweat chloride loss rapidly causes hyponatraemic, hypochloraemic dehydration during heatwaves or fever.',
      'Distal Intestinal Obstruction Syndrome (DIOS): Inspissated sticky gut contents cause acute right iliac fossa pain and bowel obstruction.',
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
      'Auscultation: Coarse inspiratory/expiratory crackles and scattered wheeze are commonly present at baseline.',
      'Exacerbation: Increased sputum thickness/volume, pleuritic pain, fever, or small amounts of blood-streaked sputum.',
    ],
    treatments: [
      'Airway Clearance: Daily chest physiotherapy techniques, Acapella/Flutter devices, and carbocisteine.',
      'Targeted Antibiotics: Standby 14-day courses or long-term prophylactic azithromycin / nebulised colistimethate.',
      'Bronchodilators: Salbutamol or tiotropium if reversible airflow obstruction coexists.',
    ],
    commonMeds: ['Carbocisteine', 'Azithromycin', 'Salbutamol', 'Amoxicillin'],
    acuteComplications: [
      'Frank Haemoptysis: Chronic bronchial inflammation erodes fragile vessels, causing sudden large-volume coughing of fresh blood.',
      'Severe Infective Exacerbations: Colonisation with Pseudomonas or multi-resistant bacteria drives rapid hypoxaemia and sepsis.',
      'Type 2 Respiratory Failure: Advanced bilateral bronchiectasis can cause chronic CO₂ retention similar to severe COPD.',
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
      'Exertional Desaturation: Resting SpO₂ may look acceptable, then plummet steeply with minimal physical effort.',
      'Home Oxygen: Many patients use ambulatory or continuous home oxygen cylinders/concentrators.',
    ],
    treatments: [
      'Antifibrotics: Pirfenidone or nintedanib to slow progression in IPF.',
      'Immunosuppression: Prednisolone or mycophenolate in inflammatory/connective-tissue ILD.',
      'Supportive: Long-term oxygen therapy, pulmonary rehabilitation, and palliative opiates for severe dyspnoea.',
    ],
    commonMeds: ['Nintedanib', 'Pirfenidone', 'Prednisolone', 'Mycophenolate mofetil', 'Morphine'],
    acuteComplications: [
      'Profound Type 1 Hypoxaemic Failure: Stiff fibrotic lungs typically do not retain CO₂, but suffer catastrophic oxygen drops during acute infection or exertion.',
      'Acute IPF Exacerbation: Rapid idiopathic deterioration of fibrosis over days mimics severe pneumonia or ARDS and carries high mortality.',
      'Secondary Pulmonary Hypertension: Chronic hypoxic vasoconstriction and destroyed capillary beds strain the right ventricle.',
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
      'Crisis Cascade: Physiological stress without extra hydrocortisone triggers profound distributive/hypovolaemic shock resistant to fluids alone.',
    ],
    symptomsAndBaseline: [
      'Chronic Features: Fatigue, weight loss, salt craving, postural dizziness, and bronze skin hyperpigmentation (palmar creases, gums).',
      'Acute Decompensation: Severe hypotension, persistent vomiting, abdominal or back pain, confusion, and hypoglycaemia.',
      'Patient Alerts: Patients usually carry an NHS Steroid Emergency Card and often hold an emergency IM hydrocortisone kit.',
    ],
    treatments: [
      'Daily Replacement: Oral hydrocortisone (cortisol) plus fludrocortisone (aldosterone replacement).',
      'Sick-Day Rules: Doubling oral hydrocortisone during minor illness/fever.',
      'Emergency Crisis Care: Parenteral hydrocortisone 100 mg and IV 0.9% sodium chloride replacement.',
    ],
    commonMeds: ['Hydrocortisone', 'Fludrocortisone', 'Prednisolone'],
    acuteComplications: [
      'Addisonian (Adrenal) Crisis: Infection, gastroenteritis, trauma, or missed steroids precipitates refractory vasodilatory and hypovolaemic shock that responds poorly to fluids until cortisol is replaced.',
      'Profound Hypoglycaemia: Cortisol deficiency impairs hepatic gluconeogenesis, rapidly dropping blood glucose—especially alongside vomiting.',
      'Electrolyte Derangement: Aldosterone deficit drives severe hyponatraemia and life-threatening hyperkalaemia.',
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
      'Hypoglycaemia: Sweating, tremor, confusion/aggression, slurred speech, seizures, or coma (BM <4.0 mmol/L).',
      'Wearable Tech: Most UK patients now wear Libre/Dexcom CGM sensors (which can lag behind capillary glucose during rapid swings) and/or insulin pumps.',
    ],
    treatments: [
      'Basal-Bolus Insulin: Long-acting (insulin glargine/degludec) plus rapid-acting mealtime insulin (NovoRapid/Fiasp) or continuous pump.',
      'Hypo Rescue: Rapid oral glucose, IV glucose 10%, or IM glucagon.',
      'DKA Protocol: Hospital IV 0.9% sodium chloride, fixed-rate IV insulin infusion, and potassium monitoring.',
    ],
    commonMeds: ['Insulin aspart', 'Insulin glargine', 'Insulin degludec', 'Glucagon'],
    acuteComplications: [
      'Diabetic Ketoacidosis (DKA): Infection, pump failure, or missed insulin drives severe dehydration, metabolic acidosis, and dangerous total-body potassium shifts.',
      'Severe Hypoglycaemia: Excess insulin or missed meals causes neuroglycopenic seizures, coma, or fatal arrhythmias.',
      'Euglycaemic DKA: Ketoacidosis can still occur with only mildly raised blood glucose (<11 mmol/L), particularly during fasting illness or concurrent SGLT2 inhibitor use.',
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
      'Normal Blood Glucose: Blood glucose remains normal, as the disorder affects water regulation rather than insulin.',
      'Dehydration Signs: Lethargy, confusion, dry mucous membranes, and tachycardia if unable to keep up with fluid losses.',
    ],
    treatments: [
      'Cranial DI: Desmopressin (DDAVP) nasal spray, oral tablets, or sublingual melts—a time-critical NHS medication.',
      'Nephrogenic DI: Thiazide diuretics, NSAIDs, or adjusting lithium under specialist care.',
    ],
    commonMeds: ['Desmopressin', 'Bendroflumethiazide', 'Lithium carbonate'],
    acuteComplications: [
      'Severe Hypernatraemic Dehydration: Vomiting, reduced consciousness, or missed desmopressin doses prevents drinking to match renal water loss, causing cellular brain shrinkage, seizures, and coma.',
      'Hyponatraemia (Water Intoxication): Excess desmopressin combined with excessive fluid intake can conversely trigger dangerous dilutional hyponatraemia.',
      'Post-Pituitary Crisis: Cranial DI after neurosurgery frequently coexists with panhypopituitarism and acute adrenal insufficiency.',
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
      'Catecholamine Surges: Tumour cells release massive pulses of adrenaline and noradrenaline either spontaneously or when provoked by abdominal pressure, stress, anaesthesia, or certain drugs (e.g. metoclopramide or unopposed beta-blockers).',
      'Alpha & Beta Overload: Extreme alpha-mediated vasoconstriction spikes BP dangerously while beta stimulation drives tachyarrhythmias.',
    ],
    symptomsAndBaseline: [
      'Classic Triad: Episodic severe throbbing headache, profuse drenching sweats, and pounding palpitations.',
      'Pallor & Panic: Extreme facial pallor (rather than flushing), tremor, chest tightness, and a sense of impending doom.',
      'Labile BP: Wild blood pressure swings from severe hypertensive crisis to postural hypotension.',
    ],
    treatments: [
      'Pre-Operative Blockade: Alpha-blockers FIRST (phenoxybenzamine or doxazosin) before adding a beta-blocker (propranolol/bisoprolol).',
      'Definitive Cure: Specialist laparoscopic adrenalectomy once safely alpha-blocked.',
    ],
    commonMeds: ['Doxazosin', 'Phenoxybenzamine', 'Propranolol', 'Bisoprolol'],
    acuteComplications: [
      'Catecholamine Storm: Unprovoked or drug-triggered surges (including unopposed beta-blockade causing unopposed alpha vasoconstriction) precipitate malignant hypertension, stroke, or acute pulmonary oedema.',
      'Stress Cardiomyopathy & Arrhythmias: Catecholamine excess causes Takotsubo cardiomyopathy, myocardial ischaemia, and ventricular tachyarrhythmias.',
      'Rebound Orthostatic Shock: Chronic vasoconstriction contracts intravascular volume, causing paradoxical severe hypotension between surges.',
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
      'Vaso-Occlusive Crisis: Severe deep bone, back, chest, or abdominal pain triggered by cold, infection, stress, or dehydration.',
      'Acute Chest Syndrome: Fever, cough, chest pain, tachypnoea, and falling SpO₂.',
      'Chronic Baseline: Haemoglobin typically sits at 70–90 g/L with mild scleral jaundice; many patients carry NHS Sickle Cell Alert Cards.',
    ],
    treatments: [
      'Crisis Management: Rapid strong analgesia, warmth, fluid hydration, oxygen when hypoxic, and early antibiotics.',
      'Disease Modification: Hydroxycarbamide (hydroxyurea), folic acid, prophylactic phenoxymethylpenicillin, or exchange blood transfusions.',
    ],
    commonMeds: ['Hydroxycarbamide', 'Folic acid', 'Phenoxymethylpenicillin', 'Morphine', 'Paracetamol'],
    acuteComplications: [
      'Acute Chest Syndrome: Pulmonary vaso-occlusion and infection rapidly cause worsening hypoxia and respiratory failure—the leading cause of death in adult SCD.',
      'Overwhelming Sepsis: Functional asplenia allows rapid progression of pneumococcal or meningococcal septicaemia.',
      'Stroke & Splenic Sequestration: Intracranial vessel sickling can cause acute ischaemic or haemorrhagic stroke, while sudden splenic trapping drops haemoglobin abruptly.',
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
      'Fatigue & Flares: Marked fatigue, low-grade fevers, and often long-term oral steroid use.',
    ],
    treatments: [
      'Foundation Therapy: Hydroxychloroquine for virtually all SLE patients.',
      'Immunosuppression: Prednisolone, azathioprine, mycophenolate, methotrexate, or rituximab/belimumab.',
    ],
    commonMeds: ['Hydroxychloroquine', 'Prednisolone', 'Mycophenolate mofetil', 'Azathioprine', 'Methotrexate'],
    acuteComplications: [
      'Opportunistic & Neutropenic Sepsis: Immunosuppressive therapies mask typical inflammatory signs while raising the risk of rapid severe infection.',
      'Serositis & Pericardial Effusion: Active lupus inflammation can cause acute pericarditis, cardiac tamponade, or pleural effusions.',
      'Premature Vascular Events & NPSLE: Accelerated atherosclerosis and overlapping antiphospholipid antibodies increase risk of young-onset MI, PE, stroke, and lupus seizures.',
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
      'Lidocaine Resistance: Local anaesthetics such as lidocaine are frequently less effective in EDS patients.',
    ],
    treatments: [
      'Supportive Care: Specialist physiotherapy, joint bracing, multimodal analgesia, and PoTS management.',
      'vEDS Surveillance: Celiprolol in specialist vascular centres to reduce arterial wall stress and strict trauma avoidance.',
    ],
    commonMeds: ['Paracetamol', 'Gabapentin', 'Amitriptyline', 'Ivabradine', 'Cetirizine'],
    acuteComplications: [
      'Spontaneous Vascular & Organ Rupture (vEDS): Fragile connective tissue in Vascular EDS predisposes to spontaneous aortic/arterial dissection, carotid-cavernous fistula, pneumothorax, and bowel or uterine perforation.',
      'Recurrent Dislocations & Craniocervical Instability: Minor movements can provoke acute large-joint dislocations or brainstem compression symptoms.',
      'MCAS Anaphylactoid Flares: Coexisting mast cell activation causes sudden flushing, urticaria, bronchospasm, and hypotension.',
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
      'Haemarthrosis: Early tingling/warmth ("aura") followed by painful swollen knees, ankles, or elbows.',
      'Deep Haematomas: Risk of muscle haematomas from minor knocks or intramuscular trauma.',
      'Haemophilia Care Cards: Patients hold UK Haemophilia Centre emergency contact cards and often keep home factor concentrates.',
    ],
    treatments: [
      'Factor Replacement: Prophylactic or emergency IV Factor VIII / Factor IX concentrates, or subcutaneous emicizumab.',
      'Adjunct Clotting: Tranexamic acid for mucosal bleeds (nosebleeds, mouth) and desmopressin (DDAVP) in mild Haemophilia A.',
    ],
    commonMeds: ['Tranexamic acid', 'Desmopressin'],
    acuteComplications: [
      'Intracranial Haemorrhage: Even seemingly trivial head knocks can cause delayed, progressive brain bleeding without immediate neurological signs.',
      'Airway & Neck Haematoma: Floor-of-mouth, tongue, or neck bleeds can expand silently to cause acute airway obstruction.',
      'Compartment Syndrome & Iliopsoas Bleed: Deep intramuscular or retroperitoneal haemorrhage can cause hypovolaemic shock, femoral nerve palsy, or limb ischaemia.',
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
      'Vascular History: Young-onset stroke/TIA, PE, DVT, or mottled net-like skin rash (livedo reticularis).',
      'Migraine & Visual Aura: Frequent vascular headaches and transient visual disturbance.',
      'Lifelong Anticoagulation: Most patients take warfarin (often targeting higher INRs of 2.5–3.5) rather than DOACs.',
    ],
    treatments: [
      'Long-Term Warfarin: Warfarin (usually preferred over DOACs in high-risk/triple-positive APS) or low-molecular-weight heparin in pregnancy.',
      'Antiplatelets & SLE Meds: Low-dose aspirin or hydroxychloroquine if secondary to lupus.',
    ],
    commonMeds: ['Warfarin', 'Aspirin', 'Hydroxychloroquine', 'Enoxaparin'],
    acuteComplications: [
      'Venous & Arterial Thromboembolism: High risk of acute pulmonary embolism, DVT, ischaemic stroke, and myocardial infarction—including in young adults.',
      'Catastrophic APS (CAPS): Rare life-threatening storm of widespread microvascular thrombosis causing rapid multi-organ failure over days.',
      'Anticoagulant Haemorrhage: High-target warfarin therapy raises the risk of severe bleeding following head trauma or GI ulceration.',
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
      'Haemodialysis Access: Many Stage 5 patients have a surgical arteriovenous (AV) fistula in a forearm/upper arm (palpable "thrill") or a tunnelled chest Tesio/permcath line.',
      'Peritoneal Dialysis: Indwelling abdominal PD catheter.',
      'Uraemic Baseline: Fatigue, pruritus, baseline mild anaemia, and reduced daily urine output.',
    ],
    treatments: [
      'Renal Protection: Ramipril/losartan, dapagliflozin, and strict BP control.',
      'Dialysis & Support: 3x-weekly haemodialysis or daily peritoneal dialysis, phosphate binders, vitamin D, and erythropoietin.',
    ],
    commonMeds: ['Ramipril', 'Dapagliflozin', 'Furosemide', 'Folic acid', 'Calcium carbonate'],
    acuteComplications: [
      'Severe Hyperkalaemia: Missed dialysis or intercurrent illness spikes serum potassium, causing peaked T waves, widened QRS, sine-wave ECGs, bradycardia, and cardiac arrest.',
      'Flash Pulmonary Oedema: Fluid overload between dialysis sessions rapidly floods alveoli, causing acute dyspnoea and hypoxia.',
      'AV Fistula Rupture & Infection: High-pressure arterialised fistula bleeding can cause fatal exsanguination, while tunnelled lines and PD catheters carry high sepsis/peritonitis risk.',
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
      'Encephalopathy Features: Reversed sleep cycle, confusion, slurred speech, and flapping hand tremor (asterixis).',
      'Coagulopathy: Easy bruising and prolonged bleeding from minor mucosal or skin injuries.',
    ],
    treatments: [
      'Varices Prevention: Carvedilol or propranolol (non-selective beta-blockers) and endoscopic variceal band ligation.',
      'Ascites & Encephalopathy: Spironolactone, furosemide, lactulose, and rifaximin.',
    ],
    commonMeds: ['Spironolactone', 'Furosemide', 'Carvedilol', 'Lactulose', 'Rifaximin'],
    acuteComplications: [
      'Oesophageal Variceal Haemorrhage: Ruptured high-pressure varices cause massive fresh haematemesis or melaena and rapid haemorrhagic shock compounded by baseline coagulopathy.',
      'Spontaneous Bacterial Peritonitis (SBP): Bacterial translocation into ascitic fluid causes abdominal pain, fever, hepatic decompensation, and occult sepsis.',
      'Hepatic Encephalopathy & Hypoglycaemia: Constipation, infection, or GI bleeding precipitates acute confusion/coma alongside impaired hepatic glycogen stores.',
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
      'Extraintestinal Baseline: Associated joint pain, mouth ulcers, erythema nodosum, and iron-deficiency anaemia.',
    ],
    treatments: [
      'Anti-Inflammatories: Mesalazine (5-ASA) for UC; short courses of prednisolone or budesonide for flares.',
      'Immunosuppressants & Biologics: Azathioprine, methotrexate, infliximab, adalimumab, or ustekinumab.',
    ],
    commonMeds: ['Mesalazine', 'Prednisolone', 'Budesonide', 'Azathioprine', 'Loperamide'],
    acuteComplications: [
      'Toxic Megacolon & Perforation: Severe acute colitis causes colonic dilatation, high fever, tachycardia, abdominal rigidity, and septic shock.',
      'High-Output Stoma Dehydration: Gastroenteritis or flares in ileostomy patients rapidly cause severe hypovolaemia, acute kidney injury, and electrolyte loss.',
      'Bowel Obstruction & Abscess: Transmural Crohn’s strictures and fistulae frequently precipitate mechanical bowel obstruction or intra-abdominal sepsis.',
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
      'Accidental Exposure: Acute cramping abdominal pain, bloating, nausea, vomiting, and diarrhoea lasting hours to days after eating gluten.',
      'Chronic Deficiency: Iron-deficiency anaemia, fatigue, osteoporosis, and weight loss.',
      'Autoimmune Overlaps: Frequently coexists with Type 1 diabetes mellitus and autoimmune thyroid or adrenal disease.',
    ],
    treatments: [
      'Lifelong Gluten-Free Diet: Strict avoidance of wheat, barley, and rye allows mucosal healing.',
      'Nutritional Replacement: Iron, folic acid, vitamin B12, and calcium/vitamin D supplements if deficient.',
    ],
    commonMeds: ['Ferrous fumarate', 'Folic acid', 'Hydroxocobalamin', 'Colecalciferol'],
    acuteComplications: [
      'Acute Gluten Exposure Reaction: Inadvertent gluten ingestion can provoke intense vomiting, abdominal colic, and dehydration mimicking acute gastroenteritis.',
      'Autoimmune Cluster Presentations: Higher background prevalence of Type 1 diabetes (DKA/hypoglycaemia) and Addison’s disease (adrenal crisis).',
      'Hyposplenism Sepsis Risk: Approximately one-third of adult coeliac patients develop functional hyposplenism, raising susceptibility to encapsulated bacterial infections.',
    ],
  },

  // =========================================================================
  // 7. COMMON CONDITIONS EXPANSION (10)
  // =========================================================================
  {
    id: 'asthma',
    title: 'Asthma',
    phoneticSpelling: 'AS-muh',
    category: 'Respiratory',
    aliases: ['asthma', 'brittle asthma', 'status asthmaticus', 'bronchospasm', 'mart'],
    overview:
      'A chronic inflammatory airway disease characterised by bronchial hyper-responsiveness, reversible smooth-muscle bronchoconstriction, airway oedema, and excess mucus production. Symptoms fluctuate over time and are triggered by viral infections, allergens, cold air, or exercise.',
    causesAndPathophysiology: [
      'Airway Inflammation: Eosinophils, mast cells, and IgE pathways inflame the bronchial mucosa, making airways twitchy.',
      'Reversible Bronchoconstriction: Smooth muscle around small bronchioles spasms in response to triggers, narrowing the airway lumen.',
      'Mucus & Oedema: Thick mucus plugging and mucosal swelling further increase airway resistance and air trapping.',
    ],
    symptomsAndBaseline: [
      'Classic Triad: Expiratory polyphonic wheeze, chest tightness, cough (often nocturnal/early morning), and variable dyspnoea.',
      'Baseline State: Between exacerbations, chest auscultation and resting SpO₂ are usually completely normal.',
      'Triggers: Viral URTIs, pollen, pet dander, smoke, cold air, NSAIDs/aspirin (in aspirin-exacerbated disease), and beta-blockers.',
    ],
    treatments: [
      'AIR / MART Regimens: UK NICE/BTS guidelines favour combination ICS/formoterol inhalers (e.g. Symbicort, Fostair) as both preventer and reliever alongside salbutamol SABA.',
      'Oral Steroids & Leukotrienes: Short prednisolone courses for flares; montelukast or biologics (omalizumab, mepolizumab) for severe asthma.',
      'Acute Bronchodilation: Nebulised salbutamol and ipratropium bromide, parenteral hydrocortisone/prednisolone, and IV magnesium sulfate in severe flares.',
    ],
    commonMeds: ['Salbutamol', 'Beclometasone dipropionate', 'Prednisolone', 'Ipratropium bromide', 'Montelukast'],
    acuteComplications: [
      'Life-Threatening Asthma Attack: Exhaustion, silent chest, cyanosis, bradycardia, hypotension, or inability to speak in sentences indicates imminent respiratory arrest.',
      'Normal CO₂ Warning: Unlike COPD, severe asthmatics normally hyperventilate and drop CO₂—even a normal or rising PaCO₂ signifies ventilatory fatigue.',
      'Pneumothorax & Pneumomediastinum: High expiratory pressures from severe air trapping can rupture alveoli into the pleural space.',
    ],
  },
  {
    id: 'type-2-diabetes',
    title: 'Type 2 Diabetes Mellitus',
    phoneticSpelling: 'type TOO dy-uh-BEE-teez MEL-ih-tus',
    category: 'Endocrine & Metabolic',
    aliases: ['t2dm', 'type 2 diabetes', 'niddm', 'hhs', 'honk', 'hyperosmolar'],
    overview:
      'A progressive metabolic disorder driven by peripheral insulin resistance and relative beta-cell insulin deficiency, resulting in chronic hyperglycaemia. Unlike Type 1 diabetes, endogenous insulin usually prevents ketoacidosis, though severe hyperosmolar dehydration (HHS) and sulfonylurea hypoglycaemia are major acute hazards.',
    causesAndPathophysiology: [
      'Insulin Resistance: Skeletal muscle, liver, and adipose tissues respond poorly to insulin, leaving glucose circulating in blood.',
      'Beta-Cell Exhaustion: Pancreatic beta cells initially over-produce insulin before gradually declining over years.',
      'Microvascular & Macrovascular Injury: Chronic hyperglycaemia damages coronary/cerebral arteries, retinal vessels, glomeruli, and peripheral nerves.',
    ],
    symptomsAndBaseline: [
      'Baseline Profile: Often asymptomatic when controlled; chronic complications include peripheral neuropathy (stocking-glove numbness), retinopathy, CKD, and ischaemic heart disease.',
      'Hyperglycaemia Signs: Thirst, polyuria, lethargy, blurred vision, and recurrent skin or urinary infections.',
      'Therapy Spectrum: Managed from lifestyle alone through oral/injectable agents and sometimes basal or mixed insulin.',
    ],
    treatments: [
      'First-Line Oral: Metformin plus SGLT2 inhibitors (dapagliflozin, empagliflozin) for cardiorenal protection.',
      'Additional Agents: Sulfonylureas (gliclazide), DPP-4 inhibitors (sitagliptin), GLP-1 analogues (semaglutide), and insulin.',
    ],
    commonMeds: ['Metformin', 'Gliclazide', 'Dapagliflozin', 'Sitagliptin', 'Semaglutide'],
    acuteComplications: [
      'Hyperosmolar Hyperglycaemic State (HHS): Severe infection or dehydration drives extreme hyperglycaemia (>30 mmol/L), profound hypovolaemia, hyperosmolality, focal neurology, and high thrombosis risk without major ketosis.',
      'Prolonged Sulfonylurea Hypoglycaemia: Gliclazide accumulates in renal impairment or skipped meals, causing recurrent, slow-clearing hypoglycaemia.',
      'Euglycaemic DKA on SGLT2 Inhibitors: Concurrent acute illness or fasting during dapagliflozin/empagliflozin therapy can precipitate ketoacidosis despite near-normal blood glucose.',
    ],
  },
  {
    id: 'epilepsy',
    title: 'Epilepsy',
    phoneticSpelling: 'EP-ih-lep-see',
    category: 'Neurological',
    aliases: ['seizure disorder', 'fits', 'status epilepticus', 'tonic clonic', 'absence', 'epilim', 'keppra'],
    overview:
      'A chronic neurological tendency toward unprovoked recurrent seizures caused by abnormal, excessive synchronous electrical discharges in cortical neurones. Seizures vary from brief focal awareness disturbances to generalised tonic-clonic convulsions.',
    causesAndPathophysiology: [
      'Cortical Hyperexcitability: An imbalance between excitatory glutamate signalling and inhibitory GABA signalling lowers the seizure threshold.',
      'Focal vs Generalised: Focal seizures originate in one cerebral hemisphere; generalised seizures engage bilateral networks simultaneously.',
      'Aetiology: Genetic channelopathies, prior stroke scarring, traumatic brain injury, cortical dysplasia, brain tumours, or idiopathic causes.',
    ],
    symptomsAndBaseline: [
      'Seizure Semiology: Motor stiffening (tonic), rhythmic jerking (clonic), blank staring (absence), focal twitching, or sensory auras.',
      'Post-Ictal Phase: Confusion, drowsiness, headache, transient unilateral weakness (Todd’s paresis), and aching muscles after convulsions.',
      'Rescue Meds & Devices: Some patients carry buccal midazolam emergency packs or have an implanted Vagus Nerve Stimulator (VNS) in the chest.',
    ],
    treatments: [
      'Anti-Seizure Medicines: Levetiracetam, lamotrigine, sodium valproate, carbamazepine, or topiramate.',
      'Status Rescue: Buccal midazolam or rectal diazepam in the community; IV lorazepam/diazepam and levetiracetam/phenytoin in hospital.',
      'Neurostimulation: Vagal nerve stimulators (activated by swiping a dedicated magnet) for drug-resistant epilepsy.',
    ],
    commonMeds: ['Levetiracetam', 'Sodium valproate', 'Lamotrigine', 'Carbamazepine', 'Midazolam'],
    acuteComplications: [
      'Convulsive Status Epilepticus: Continuous seizure activity ≥5 minutes (or repeated seizures without regaining baseline awareness) causes hypoxia, hyperthermia, rhabdomyolysis, acidosis, and neuronal injury.',
      'Aspiration & Airway Obstruction: Loss of airway tone and ictal/post-ictal vomiting risk hypoxia and aspiration pneumonia.',
      'Seizure-Related Trauma: Tongue/cheek lacerations, shoulder dislocations, vertebral compression fractures, and head injuries.',
    ],
  },
  {
    id: 'ischaemic-heart-disease',
    title: 'Ischaemic Heart Disease & Angina (IHD)',
    phoneticSpelling: 'iss-KEE-mik hart dih-ZEEZ',
    category: 'Cardiovascular',
    aliases: ['ihd', 'cad', 'coronary artery disease', 'angina', 'previous mi', 'cabg', 'stents', 'pci'],
    overview:
      'Impaired myocardial blood supply caused by atherosclerotic narrowing of the coronary arteries. Stable angina causes predictable exertional chest tightness relieved by rest or GTN, whereas plaque rupture causes Acute Coronary Syndromes (NSTEMI/STEMI).',
    causesAndPathophysiology: [
      'Coronary Atherosclerosis: Lipid-rich fibrofatty plaques build up in coronary artery walls, narrowing lumen diameter.',
      'Supply-Demand Mismatch: Fixed stenosis limits oxygen delivery during exertion, anaemia, fever, or tachycardia (stable angina).',
      'Plaque Rupture & Thrombosis: Sudden fissuring of a vulnerable plaque triggers platelet aggregation and coronary occlusion (ACS).',
    ],
    symptomsAndBaseline: [
      'Stable Angina: Heavy, constricting chest tightness radiating to arms, neck, jaw, or epigastrium lasting 2–10 minutes with exertion and settling with rest/GTN.',
      'Surgical Baseline: Many patients have prior coronary stents (PCI) or median sternotomy scars from CABG bypass grafting.',
      'Baseline ECG: Old Q waves, T-wave flattening, or left bundle branch block from previous infarction are common.',
    ],
    treatments: [
      'Anti-Anginals: Sublingual glyceryl trinitrate (GTN), beta-blockers (bisoprolol), calcium-channel blockers (amlodipine), and isosorbide mononitrate.',
      'Secondary Prevention: Lifelong antiplatelets (aspirin/clopidogrel/ticagrelor), high-intensity statin (atorvastatin), and ACE inhibitors.',
    ],
    commonMeds: ['Glyceryl trinitrate', 'Aspirin', 'Atorvastatin', 'Bisoprolol', 'Ramipril'],
    acuteComplications: [
      'Acute Coronary Syndrome (STEMI / NSTEMI): Unheralded, prolonged chest pain at rest (>15 minutes) unremitting with GTN signals coronary thrombosis and myocardial necrosis.',
      'Cardiogenic Shock & Pulmonary Oedema: Extensive ventricular ischaemia impairs pump output, dropping blood pressure and flooding the lungs.',
      'Ischaemic Arrhythmias: Acute myocardial irritability frequently triggers ventricular tachycardia, ventricular fibrillation, or complete heart block.',
    ],
  },
  {
    id: 'hypertension',
    title: 'Hypertension',
    phoneticSpelling: 'hy-per-TEN-shun',
    category: 'Cardiovascular',
    aliases: ['htn', 'high blood pressure', 'malignant hypertension', 'hypertensive emergency'],
    overview:
      'Persistently elevated systemic arterial blood pressure (≥140/90 mmHg in clinic) that chronically damages blood vessel endothelium and forces the heart to pump against higher afterload. Usually asymptomatic at baseline, it underpins stroke, heart failure, aortic dissection, and CKD.',
    causesAndPathophysiology: [
      'Increased Peripheral Resistance: Essential hypertension (~90–95%) stems from arteriolar stiffening, high sympathetic tone, and renal salt/water dysregulation.',
      'Secondary Causes: Renal artery stenosis, CKD, Conn’s syndrome, phaeochromocytoma, or obstructive sleep apnoea.',
      'End-Organ Remodelling: Left ventricular hypertrophy, hyaline arteriolosclerosis, and accelerated atherosclerosis.',
    ],
    symptomsAndBaseline: [
      'Asymptomatic Baseline: Chronic mild-to-moderate hypertension rarely causes headaches or dizziness on its own.',
      'White-Coat & Pain Surges: Transient BP spikes (e.g. 170–190 systolic) frequently accompany acute pain, anxiety, or bladder retention without true organ damage.',
    ],
    treatments: [
      'NICE Stepped Therapy: Calcium-channel blockers (amlodipine), ACEi/ARBs (ramipril, losartan), and thiazide-like diuretics (indapamide).',
      'Resistant Disease: Spironolactone, alpha-blockers (doxazosin), or beta-blockers.',
    ],
    commonMeds: ['Amlodipine', 'Ramipril', 'Indapamide', 'Losartan', 'Bisoprolol'],
    acuteComplications: [
      'Hypertensive Emergency: Severe BP elevation (often >180/120 mmHg) accompanied by acute end-organ injury such as encephalopathy, papilloedema, intracerebral haemorrhage, ACS, pulmonary oedema, or aortic dissection.',
      'Aortic Dissection: Longstanding uncontrolled hypertension weakens aortic media, predisposing to sudden tearing chest/back pain.',
      'Postural Hypotension from Therapy: Over-treated or frail hypertensive patients commonly suffer orthostatic drops and falls on standing.',
    ],
  },
  {
    id: 'dementia',
    title: "Dementia (Alzheimer's & Vascular)",
    phoneticSpelling: 'dih-MEN-shuh',
    category: 'Neurological',
    aliases: ['alzheimers', 'vascular dementia', 'lewy body dementia', 'cognitive impairment', 'delirium'],
    overview:
      'An umbrella term for progressive, irreversible neurodegenerative or cerebrovascular syndromes causing decline in memory, reasoning, language, and daily living skills. Unlike acute delirium, true dementia evolves over months to years.',
    causesAndPathophysiology: [
      'Alzheimer’s Disease: Progressive deposition of extracellular beta-amyloid plaques and intracellular tau neurofibrillary tangles causes cortical atrophy and acetylcholine loss.',
      'Vascular Dementia: Cumulative small-vessel ischaemia or stepwise strokes infarct subcortical white matter.',
      'Lewy Body Dementia: Alpha-synuclein deposits cause fluctuating alertness, visual hallucinations, Parkinsonism, and severe neuroleptic sensitivity.',
    ],
    symptomsAndBaseline: [
      'Cognitive Baseline: Impaired short-term recall, word-finding difficulty, disorientation to time/place, and reliance on carers/family for medication and personal care.',
      'Behavioural Features: Sundowning (late-afternoon agitation), repetitive questioning, or distress in unfamiliar noisy environments.',
      'Care Plans: Many advanced patients hold ReSPECT forms or DNACPR decisions at home or in care homes.',
    ],
    treatments: [
      'Cognitive Enhancers: Acetylcholinesterase inhibitors (donepezil, rivastigmine, galantamine) or NMDA antagonist (memantine).',
      'Vascular Risk Control: Antiplatelets, statins, and BP control in vascular dementia.',
    ],
    commonMeds: ['Donepezil', 'Memantine', 'Rivastigmine', 'Galantamine'],
    acuteComplications: [
      'Acute Delirium on Dementia: Sudden worsening confusion, lethargy, or agitation is typically driven by an acute physical trigger (UTI, chest infection, constipation, urinary retention, hypoxia, or pain) rather than dementia progression.',
      'Falls & Occult Fractures: Impaired spatial awareness and reduced pain reporting increase risk of neck-of-femur fractures and subdural bleeds.',
      'Neuroleptic Sensitivity (DLB): Patients with Dementia with Lewy Bodies can suffer severe rigidity, autonomic collapse, and sudden worsening if exposed to typical antipsychotics.',
    ],
  },
  {
    id: 'cerebrovascular-disease',
    title: 'Previous Stroke & TIA (Cerebrovascular Disease)',
    phoneticSpelling: 'seh-ree-broh-VAS-kyoo-ler dih-ZEEZ',
    category: 'Neurological',
    aliases: ['cva', 'stroke', 'tia', 'cerebrovascular accident', 'hemiparesis', 'dysphasia'],
    overview:
      'Long-term neurological deficits and vascular vulnerability following prior focal brain infarction (ischaemic stroke), intracerebral haemorrhage, or transient ischaemic attack (TIA). Pre-existing motor, speech, or visual deficits can closely complicate assessment of new acute events.',
    causesAndPathophysiology: [
      'Ischaemic Infarction: ~85% of UK strokes result from large-artery atherosclerosis, cardioembolism (e.g. AF), or small-vessel lacunar occlusion.',
      'Haemorrhagic Rupture: ~15% result from hypertensive microaneurysm rupture, amyloid angiopathy, or anticoagulant bleeding.',
      'Gliotic Scar & Neuroplasticity: Infarcted brain tissue leaves permanent focal scarring, lowered seizure threshold, and chronic spasticity.',
    ],
    symptomsAndBaseline: [
      'Residual Deficits: Unilateral limb weakness/spasticity, facial asymmetry, expressive or receptive dysphasia, hemianopia, or dysphagia.',
      'PEG & Spasticity Aids: Severe strokes may leave patients with ankle-foot orthoses, baclofen, or PEG feeding tubes.',
    ],
    treatments: [
      'Ischaemic Secondary Prevention: Lifelong clopidogrel (or aspirin + dipyridamole), high-dose atorvastatin, BP control, and AF anticoagulation.',
      'Spasticity & Post-Stroke Epilepsy: Oral baclofen, botulinum toxin injections, or anti-seizure medicines (levetiracetam).',
    ],
    commonMeds: ['Clopidogrel', 'Atorvastatin', 'Apixaban', 'Aspirin', 'Amlodipine'],
    acuteComplications: [
      'Recurrent Stroke or TIA: Prior stroke markedly raises risk of repeat vascular occlusion or haemorrhage, particularly if antiplatelets/anticoagulants are interrupted.',
      'Post-Stroke Epilepsy: Cortical scar tissue is a common cause of new-onset focal or generalised seizures months to years after stroke.',
      'Aspiration Pneumonia: Residual pharyngeal dysphagia remains one of the commonest causes of emergency hospital admission.',
    ],
  },
  {
    id: 'hypothyroidism',
    title: 'Hypothyroidism',
    phoneticSpelling: 'hy-poh-THY-roid-izm',
    category: 'Endocrine & Metabolic',
    aliases: ['underactive thyroid', 'myxoedema', 'myxoedema coma', 'levothyroxine', 'hashimotos'],
    overview:
      'Deficiency of thyroid hormones (T4 and T3), slowing whole-body cellular metabolism, heart rate, gut motility, and thermoregulation. In the UK it is most often autoimmune (Hashimoto’s thyroiditis) and straightforwardly managed with daily oral levothyroxine.',
    causesAndPathophysiology: [
      'Autoimmune Thyroiditis: Autoantibodies gradually destroy thyroid follicles; other causes include prior radioiodine/thyroidectomy or amiodarone/lithium therapy.',
      'Metabolic Slowing: Low thyroid hormone reduces basal metabolic rate, cardiac contractility, adrenergic receptor sensitivity, and renal free-water clearance.',
    ],
    symptomsAndBaseline: [
      'Chronic Features: Fatigue, cold intolerance, weight gain, constipation, dry coarse skin, bradycardia, and hoarse voice.',
      'Euthyroid Baseline: Once stabilised on levothyroxine, patients are completely normal with standard observations.',
    ],
    treatments: [
      'Hormone Replacement: Once-daily oral levothyroxine sodium taken on an empty stomach.',
      'Myxoedema Care: Specialist hospital IV liothyronine/levothyroxine, hydrocortisone cover, and passive warming if severe.',
    ],
    commonMeds: ['Levothyroxine sodium'],
    acuteComplications: [
      'Myxoedema Coma: Rarely, prolonged untreated hypothyroidism decompensates during cold exposure, infection, or sedative use into hypothermia (<35°C), profound bradycardia, hypotension, hypoventilation, and coma.',
      'Dilutional Hyponatraemia: Impaired renal free-water excretion in severe hypothyroidism lowers serum sodium, compounding confusion.',
      'Cardiac Over-Replacement Risks: Excessive levothyroxine doses in elderly or IHD patients can precipitate fast AF or angina.',
    ],
  },
  {
    id: 'gord-peptic-ulcer-disease',
    title: 'GORD & Peptic Ulcer Disease',
    phoneticSpelling: 'gord & PEP-tik UL-ser dih-ZEEZ',
    category: 'GI, Hepatic & Renal',
    aliases: ['gord', 'gerd', 'acid reflux', 'peptic ulcer', 'gastric ulcer', 'duodenal ulcer', 'upper gi bleed'],
    overview:
      'Gastro-oesophageal reflux disease (GORD) occurs when gastric acid repeatedly washes past an incompetent lower oesophageal sphincter, whereas peptic ulcer disease involves mucosal breaks in the stomach or duodenum—chiefly driven by Helicobacter pylori or NSAIDs.',
    causesAndPathophysiology: [
      'Acid Reflux: Transient lower oesophageal sphincter relaxations or hiatus hernia expose squamous oesophageal mucosa to gastric acid and pepsin.',
      'Mucosal Ulceration: H. pylori infection or NSAID-mediated prostaglandin blockade strips the protective gastric mucus/bicarbonate barrier.',
    ],
    symptomsAndBaseline: [
      'Typical Features: Retrosternal burning heartburn (worse lying flat or after heavy meals), acid brash, belching, or gnawing epigastric pain.',
      'Cardiac Mimic: Severe oesophageal spasm and reflux frequently mimic angina or ACS chest pain, and sometimes briefly settle after GTN spray.',
    ],
    treatments: [
      'Acid Suppression: Proton pump inhibitors (omeprazole, lansoprazole) or H2-receptor antagonists (famotidine).',
      'Mucosal Protection & Eradication: Alginate antacids (Gaviscon) and antibiotic triple therapy for H. pylori.',
    ],
    commonMeds: ['Omeprazole', 'Lansoprazole', 'Famotidine'],
    acuteComplications: [
      'Upper GI Haemorrhage: Ulcer erosion into submucosal vessels (especially alongside NSAIDs, aspirin, or anticoagulants) causes fresh/coffee-ground haematemesis, melaena, and hypovolaemic shock.',
      'Perforated Peptic Ulcer: Full-thickness ulcer rupture spills gastric acid into the peritoneum, producing sudden-onset agonising epigastric pain, board-like abdominal rigidity, and shock.',
      'Oesophageal Stricture & Mallory-Weiss Tear: Severe retching or chronic scarring can cause acute dysphagia or mucosal bleeding.',
    ],
  },
  {
    id: 'rheumatoid-arthritis',
    title: 'Rheumatoid Arthritis',
    phoneticSpelling: 'ROO-muh-toid ar-THRY-tis',
    category: 'Autoimmune & Haematology',
    aliases: ['ra', 'rheumatoid', 'dmard', 'methotrexate', 'atlantoaxial subluxation'],
    overview:
      'A chronic systemic autoimmune inflammatory arthritis targeting synovial joint linings (especially hands, wrists, feet, and cervical spine) alongside extra-articular involvement of the lungs, pericardium, and blood vessels.',
    causesAndPathophysiology: [
      'Synovial Pannus: Autoantibodies (RF, anti-CCP) and cytokines (TNF-alpha, IL-6) inflame synovium, forming invasive pannus tissue that erodes cartilage and bone.',
      'Systemic Inflammation: Circulating cytokines accelerate cardiovascular disease and can inflame pleura, lung interstitium, sclera, and peripheral nerves.',
    ],
    symptomsAndBaseline: [
      'Joint Baseline: Symmetrical small-joint swelling, morning stiffness (>30 mins), ulnar deviation, swan-neck deformities, and rheumatoid nodules.',
      'Extra-Articular: Dry eyes/mouth (Sjögren’s overlap), interstitial lung fibrosis, or peripheral neuropathy.',
      'Immunosuppression: Patients routinely take weekly methotrexate or biologic injections and sometimes long-term oral steroids.',
    ],
    treatments: [
      'csDMARDs: Once-weekly methotrexate (with folic acid), sulfasalazine, leflunomide, or hydroxychloroquine.',
      'Biologics & Targeted Therapy: Adalimumab, etanercept, rituximab, or JAK inhibitors (upadacitinib/baricitinib).',
      'Flare Control: Short oral prednisolone courses or intra-articular steroid injections.',
    ],
    commonMeds: ['Methotrexate', 'Sulfasalazine', 'Hydroxychloroquine', 'Prednisolone', 'Folic acid'],
    acuteComplications: [
      'Cervical Spine (Atlantoaxial) Instability: Chronic C1–C2 ligament erosion can cause spinal cord compression during sudden neck flexion/extension or minor trauma.',
      'Septic Arthritis & Opportunistic Sepsis: Biologic/DMARD immunosuppression predisposes to rapid systemic infection, and a single hot swollen joint may represent bacterial septic arthritis rather than a simple flare.',
      'Pericarditis & ILD: Rheumatoid serositis can cause acute pleuritic chest pain or pericardial effusion, and methotrexate/RA-ILD can worsen baseline lung function.',
    ],
  },
];
