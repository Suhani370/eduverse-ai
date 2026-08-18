import { StructuredEducationalResponse } from '../types';

export const DEMO_RESPONSES: Record<string, StructuredEducationalResponse> = {
  'photosynthesis': {
    id: 'demo-photosynthesis',
    query: 'Explain photosynthesis with a visual flow',
    timestamp: new Date().toISOString(),
    language: 'English',
    educationLevel: 'middle_school',
    responseStyle: 'normal',
    quickAnswer: 'Photosynthesis is the biological process where green plants, algae, and some bacteria convert light energy (from the sun) into chemical energy (glucose/sugar), using carbon dioxide and water, while releasing oxygen as a byproduct.',
    simpleExplanation: 'Plants act like tiny solar-powered food kitchens. Using green pigment called chlorophyll, they capture rays from the Sun, drink water from the soil through roots, and breathe in carbon dioxide from the air through microscopic leaf pores (stomata). They mix these ingredients together to bake sweet glucose (plant food) and release fresh oxygen into our air!',
    realWorldAnalogy: {
      analogy: 'The Solar-Powered Bakery',
      explanation: 'Imagine a bakery with solar panels on the roof (Chlorophyll). The baker brings in flour (CO₂ from air) and water from the tap (Water from soil). Using energy from the solar panels (Sunlight), the oven bakes delicious bread (Glucose) for the plant to grow, and blows clean fresh air out the chimney (Oxygen) for animals to breathe.',
      targetContext: 'Photosynthesis as an energy conversion and food preparation factory'
    },
    detailedExplanation: 'Photosynthesis occurs primarily in plant leaves inside specialized cellular organelles called **chloroplasts**. It is governed by the universal chemical equation:\n\n$$\\text{6CO}_2 + \\text{6H}_2\\text{O} + \\text{Light Energy} \\xrightarrow{\\text{Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{6O}_2$$\n\nIt consists of two main sequential stages:\n1. **Light-Dependent Reactions (in Thylakoid membranes):** Chlorophyll absorbs photons, which excites electrons and splits water molecules ($H_2O \\rightarrow 2H^+ + \\frac{1}{2}O_2 + 2e^-$). Oxygen gas is released, while ATP and NADPH are synthesized to store energy.\n2. **Light-Independent Reactions / Calvin Cycle (in Stroma):** Utilizing ATP and NADPH from the first stage, carbon dioxide ($CO_2$) is fixed into organic molecules to produce high-energy glucose sugar ($C_6H_{12}O_6$).',
    visualization: {
      type: 'flowchart',
      title: 'Photosynthesis Energy & Material Pathway',
      description: 'Step-by-step conversion of raw environmental inputs into organic glucose and oxygen gas.',
      nodes: [
        { id: 'sun', label: 'Sunlight Energy', sublabel: 'Photons absorbed by Chlorophyll', icon: 'Sun', color: '#f59e0b', details: 'Drives electron transport chain in thylakoids' },
        { id: 'water', label: 'Water (H₂O)', sublabel: 'Absorbed via Roots & Xylem', icon: 'Droplets', color: '#38bdf8', details: 'Splits during photolysis to donate electrons' },
        { id: 'co2', label: 'Carbon Dioxide (CO₂)', sublabel: 'Enters via Stomata pores', icon: 'Wind', color: '#a855f7', details: 'Fixed during Calvin cycle in stroma' },
        { id: 'chloroplast', label: 'Chloroplast Factory', sublabel: 'Thylakoids & Stroma', icon: 'Leaf', color: '#22c55e', details: 'Site of light reactions and chemical synthesis' },
        { id: 'glucose', label: 'Glucose (C₆H₁₂O₆)', sublabel: 'Stored Plant Food & Energy', icon: 'Sparkles', color: '#10b981', details: 'Fuel for cellular respiration and starch storage' },
        { id: 'oxygen', label: 'Oxygen Gas (O₂)', sublabel: 'Released to Atmosphere', icon: 'Cloud', color: '#06b6d4', details: 'Essential byproduct supporting aerobic life on Earth' }
      ],
      edges: [
        { from: 'sun', to: 'chloroplast', label: 'Radiant Energy' },
        { from: 'water', to: 'chloroplast', label: 'H⁺ & Electrons' },
        { from: 'co2', to: 'chloroplast', label: 'Carbon Input' },
        { from: 'chloroplast', to: 'glucose', label: 'Chemical Synthesis' },
        { from: 'chloroplast', to: 'oxygen', label: 'Gaseous Byproduct' }
      ],
      steps: [
        { stepNumber: 1, title: 'Light Absorption & Water Splitting', description: 'Chlorophyll in thylakoids captures photons; water molecules are split, releasing O₂ gas.', analogy: 'Solar panels power up the machine and water is fed in.' },
        { stepNumber: 2, title: 'Energy Storage (ATP & NADPH)', description: 'Solar energy is temporarily locked into mobile energy carriers ATP and NADPH.', analogy: 'Batteries are charged for the baking process.' },
        { stepNumber: 3, title: 'Carbon Fixation (Calvin Cycle)', description: 'CO₂ from the air is captured by the enzyme RuBisCO in the chloroplast stroma.', analogy: 'Raw ingredients are added to the mixing bowl.' },
        { stepNumber: 4, title: 'Glucose Sugar Formation', description: 'Chemical reactions assemble 3-carbon sugars into stable glucose (C₆H₁₂O₆).', analogy: 'Fresh bread loaves come out of the oven!' }
      ]
    },
    keyPoints: [
      'Photosynthesis converts solar light energy into stable chemical energy (glucose).',
      'Occurs inside chloroplasts using chlorophyll pigments.',
      'Raw materials: Carbon Dioxide ($CO_2$) and Water ($H_2O$).',
      'End products: Glucose ($C_6H_{12}O_6$) and Oxygen ($O_2$).',
      'Two main phases: Light-dependent reactions (Thylakoids) and Calvin Cycle (Stroma).'
    ],
    commonMistakes: [
      {
        mistake: 'Believing that plants only perform photosynthesis and do not respire.',
        correction: 'Plants respire continuously (24/7), consuming oxygen and glucose to power cellular processes, especially at night.'
      },
      {
        mistake: 'Thinking the oxygen released comes from carbon dioxide ($CO_2$).',
        correction: 'Experiments show that released oxygen comes entirely from photolysis of water ($H_2O$), not from $CO_2$.'
      }
    ],
    quickRevisionCards: [
      { front: 'Where in the plant cell does photosynthesis take place?', back: 'Inside chloroplasts (specifically thylakoids for light reactions and stroma for Calvin cycle).' },
      { front: 'What is the balanced chemical equation for photosynthesis?', back: '6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂' },
      { front: 'What is the primary green pigment that traps sunlight?', back: 'Chlorophyll (a & b), located in the thylakoid membrane.' }
    ],
    practiceQuestions: [
      'Why do variegated leaves show starch synthesis only in the green patches during an iodine test?',
      'Explain how temperature and light intensity act as limiting factors according to Blackman’s Law of Limiting Factors.',
      'What would happen to the Calvin cycle if ATP and NADPH production in the thylakoids suddenly ceased?'
    ],
    examTips: [
      'In board examinations, always mention "Chlorophyll" and "Sunlight" over the reaction arrow.',
      'Remember: Water splitting occurs on the lumen side of the thylakoid membrane (Photosystem II).'
    ]
  },

  'tcp-vs-udp': {
    id: 'demo-tcp-vs-udp',
    query: 'TCP vs UDP with real-world courier analogy',
    timestamp: new Date().toISOString(),
    language: 'English',
    educationLevel: 'college_engineering',
    responseStyle: 'technical',
    quickAnswer: 'TCP (Transmission Control Protocol) is a connection-oriented, reliable, ordered protocol with flow/congestion control, whereas UDP (User Datagram Protocol) is a lightweight, connectionless, unreliable protocol prioritized for low-latency streaming and gaming.',
    simpleExplanation: 'TCP acts like a registered courier service where you must shake hands, sign for every package, and re-send any dropped parcel until everything is in exact order. UDP acts like a live megaphone or flying postal leaflets where speed is paramount; if one word gets lost in the wind, nobody stops the show.',
    realWorldAnalogy: {
      analogy: 'Registered Post with Delivery Receipts (TCP) vs. Live Radio Broadcast / Firing T-Shirts (UDP)',
      explanation: 'TCP is like ordering high-value electronics via courier: you establish a delivery slot (3-way handshake), every parcel has a serial number (sequence number), you sign an acknowledgment receipt (ACK), and damaged boxes are reshipped. UDP is like a live stadium concert: the singer sings in real-time; if you miss one beat due to crowd noise, the band doesn’t pause the entire concert for you.',
      targetContext: 'Transport Layer Network Protocol trade-offs: Reliability vs Latency'
    },
    detailedExplanation: 'Operating at Layer 4 (Transport Layer) of the OSI model, TCP and UDP provide end-to-end communication between applications:\n\n- **TCP (RFC 793):** Establishes a virtual circuit via a **3-Way Handshake (SYN -> SYN-ACK -> ACK)**. Features include byte-stream abstraction, packet sequencing, cumulative acknowledgments, automatic retransmission (ARQ / Go-Back-N / Selective Repeat), Sliding Window flow control, and AIMD congestion control.\n- **UDP (RFC 768):** Minimal message-oriented wrapper over IP with only 8 bytes of header overhead (Source Port, Dest Port, Length, Checksum). No connection establishment, no acknowledgments, no ordering guarantees, and no rate throttling.',
    comparison: {
      itemA: 'TCP (Transmission Control Protocol)',
      itemB: 'UDP (User Datagram Protocol)',
      analogy: 'Registered courier with signed receipts vs. throwing newspapers from a moving bicycle',
      summary: 'TCP guarantees 100% data integrity and ordered delivery at the cost of latency overhead. UDP provides minimum latency with zero delivery guarantees.',
      table: [
        { feature: 'Connection State', itemAValue: 'Connection-oriented (3-way Handshake)', itemBValue: 'Connectionless (Fire & Forget)', whyItMatters: 'TCP incurs 1 RTT startup delay before transmitting payload data.' },
        { feature: 'Reliability & ACK', itemAValue: 'Guaranteed delivery with ACKs & Retransmissions', itemBValue: 'Best-effort; dropped packets are discarded', whyItMatters: 'Critical files cannot tolerate loss, but audio streams prefer dropping a frame.' },
        { feature: 'Header Size', itemAValue: '20–60 bytes (Variable with options)', itemBValue: '8 bytes (Fixed)', whyItMatters: 'UDP has over 60% lower packet overhead per datagram.' },
        { feature: 'Ordering', itemAValue: 'Strictly ordered via Sequence Numbers', itemBValue: 'No ordering; packets arrive out of sequence', whyItMatters: 'TCP reorders out-of-order packets before serving the application buffer.' },
        { feature: 'Flow & Congestion Control', itemAValue: 'Sliding Window, Slow Start, Congestion Avoidance', itemBValue: 'None (Application must handle throttling)', whyItMatters: 'TCP prevents overwhelming slow receivers or congested network routers.' },
        { feature: 'Ideal Use Cases', itemAValue: 'Web (HTTP/1.1 & HTTP/2), Email (SMTP), File Transfer (FTP/SSH)', itemBValue: 'Live Gaming, VoIP, DNS, Video Streaming (WebRTC, QUIC/HTTP3)', whyItMatters: 'Dictates system responsiveness and fault tolerance.' }
      ],
      whenToUseA: [
        'When 100% data completeness is mandatory (e.g. downloading software binaries, bank transactions, web page code).',
        'When data must be consumed in strict chronological byte order without application reassembly.',
        'When built-in backpressure and congestion management are necessary.'
      ],
      whenToUseB: [
        'When real-time low latency (<50ms) is more critical than a dropped frame (e.g. FPS gaming, Zoom voice call).',
        'When queries are simple single-request/single-response (e.g. DNS lookups, NTP time sync).',
        'When broadcasting or multicasting to multiple destination hosts simultaneously.'
      ],
      realWorldExample: 'A bank transfer uses TCP so no rupee or digit is lost. A multiplayer Fortnite match uses UDP so player position coordinates arrive with zero buffering delay.'
    },
    visualization: {
      type: 'comparison',
      title: 'Protocol Architecture & Handshake Comparison',
      description: 'TCP Connection Setup vs UDP Direct Transmission',
      nodes: [
        { id: 'tcp-client', label: 'Client', sublabel: 'Sends SYN', icon: 'Laptop', color: '#6366f1', details: 'Initiates connection' },
        { id: 'tcp-synack', label: 'SYN-ACK', sublabel: 'Server responds with ACK', icon: 'ArrowRightLeft', color: '#a855f7', details: 'Synchronize sequence numbers' },
        { id: 'tcp-ack', label: 'ACK & Data Stream', sublabel: 'Connection Established', icon: 'ShieldCheck', color: '#10b981', details: 'Guaranteed byte stream transfer' },
        { id: 'udp-client', label: 'UDP Sender', sublabel: 'Direct Datagram', icon: 'Zap', color: '#f59e0b', details: 'No handshake required' },
        { id: 'udp-server', label: 'UDP Receiver', sublabel: 'Processes or Discards', icon: 'Server', color: '#06b6d4', details: 'Zero confirmation sent back' }
      ],
      steps: [
        { stepNumber: 1, title: 'TCP: SYN Packet', description: 'Client sends SYN packet with Initial Sequence Number (ISN_c).', analogy: 'Calling: "Hey, can you hear me?"' },
        { stepNumber: 2, title: 'TCP: SYN-ACK Packet', description: 'Server responds with SYN-ACK containing its own ISN_s and ACK for ISN_c + 1.', analogy: 'Replying: "Yes I hear you, can you hear me?"' },
        { stepNumber: 3, title: 'TCP: ACK & Data Transfer', description: 'Client acknowledges and begins reliable sliding window data flow.', analogy: 'Confirming: "Great, let’s talk!"' },
        { stepNumber: 4, title: 'UDP: Immediate Datagram', description: 'UDP sends 8-byte header datagram immediately with zero handshake.', analogy: 'Shouting into the megaphone instantly without asking.' }
      ]
    },
    keyPoints: [
      'TCP = Connection-oriented, Reliable, Ordered, 20-60 byte header, Flow & Congestion control.',
      'UDP = Connectionless, Unreliable (Best-effort), Unordered, 8 byte header, Ultra-low latency.',
      'Modern HTTP/3 runs on QUIC, which builds reliability and encryption on top of UDP to eliminate Head-of-Line blocking!'
    ],
    commonMistakes: [
      {
        mistake: 'Assuming UDP never checks for corrupted packets.',
        correction: 'UDP includes an optional 16-bit checksum to verify header/data integrity; if corrupted, the packet is simply discarded without requesting retransmission.'
      },
      {
        mistake: 'Thinking UDP is always faster than TCP under all circumstances.',
        correction: 'On a reliable local network without packet loss, TCP sliding windows can saturate full gigabit bandwidth with high throughput comparable to UDP.'
      }
    ],
    quickRevisionCards: [
      { front: 'What is the header size of UDP vs minimum TCP header?', back: 'UDP header is 8 bytes; minimum TCP header is 20 bytes.' },
      { front: 'What are the 3 steps of a TCP connection handshake?', back: 'SYN (from Client) -> SYN-ACK (from Server) -> ACK (from Client).' },
      { front: 'Why does DNS primarily use UDP on port 53?', back: 'Because DNS queries and responses are small single packets where 3-way handshake overhead would double lookup latency.' }
    ],
    practiceQuestions: [
      'Explain how TCP Head-of-Line (HoL) blocking occurs and how HTTP/3 solved it using QUIC over UDP.',
      'Design a custom UDP-based reliable transport protocol: what mechanisms would you implement in user-space?',
      'How does the TCP Sliding Window mechanism adapt to different receiver buffer sizes (Flow Control)?'
    ],
    interviewQuestions: [
      'What happens if a TCP ACK packet is lost during data transmission?',
      'Why can UDP support IP multicast/broadcast while standard TCP cannot?',
      'Explain the difference between TCP Flow Control and Congestion Control.'
    ]
  },

  'binary-search': {
    id: 'demo-binary-search',
    query: 'C++ code for binary search with line-by-line breakdown',
    timestamp: new Date().toISOString(),
    language: 'English',
    educationLevel: 'college_engineering',
    responseStyle: 'technical',
    quickAnswer: 'Binary Search is an efficient $O(\\log N)$ divide-and-conquer search algorithm that finds the position of a target value within a sorted array by repeatedly halving the search interval.',
    simpleExplanation: 'Imagine guessing a number between 1 and 100. If you guess 50 and are told "Too High!", you instantly eliminate all numbers from 50 to 100 in just ONE guess. Binary Search applies this exact trick on sorted lists: check the middle element; if it’s too big, look left; if it’s too small, look right!',
    realWorldAnalogy: {
      analogy: 'Looking up a name in a physical Dictionary / Phonebook',
      explanation: 'You never read a dictionary from page 1 to 1000 line-by-line (Linear Search $O(N)$). Instead, you open right to the middle. If you see letter "M" and need "T", you throw away the entire first half of the book and open the middle of the second half. In only ~10 flips, you find any word among 100,000 words!',
      targetContext: 'Algorithmic efficiency of Logarithmic Time Complexity O(log N)'
    },
    detailedExplanation: 'Binary Search works strictly on **monotonic (sorted)** datasets. At each iteration, we calculate `mid = low + (high - low) / 2` (to prevent integer overflow) and compare `arr[mid]` with `target`:\n- If `arr[mid] == target`, search succeeds.\n- If `arr[mid] < target`, discard left half: `low = mid + 1`.\n- If `arr[mid] > target`, discard right half: `high = mid - 1`.\n\nThe search space decreases as $N, N/2, N/4, \\dots, 1$. Thus, the maximum number of comparisons is $\\log_2 N$.',
    codeBlock: {
      language: 'cpp',
      algorithmName: 'Iterative Binary Search in C++',
      summary: 'Finds index of target in a sorted std::vector<int> in O(log N) time and O(1) auxiliary space.',
      code: `#include <iostream>
#include <vector>

// Returns index of target if present in sorted vector arr, otherwise -1
int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0;
    int high = static_cast<int>(arr.size()) - 1;

    while (low <= high) {
        // Safe midpoint calculation avoiding (low + high) integer overflow
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid; // Target found at index mid
        }
        else if (arr[mid] < target) {
            low = mid + 1; // Target is in the right subarray
        }
        else {
            high = mid - 1; // Target is in the left subarray
        }
    }

    return -1; // Target is not present in the array
}

int main() {
    std::vector<int> numbers = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;

    int resultIndex = binarySearch(numbers, target);

    if (resultIndex != -1) {
        std::cout << "Element " << target << " found at index: " << resultIndex << std::endl;
    } else {
        std::cout << "Element " << target << " not found in array." << std::endl;
    }

    return 0;
}`,
      lineByLine: [
        { lineRange: 'Line 5-7', explanation: 'Initialize two pointers: `low` at start (0) and `high` at the last valid index (`size - 1`).' },
        { lineRange: 'Line 9', explanation: 'Loop runs while search space is valid (`low <= high`). If `low > high`, target does not exist.' },
        { lineRange: 'Line 11', explanation: 'Calculates `mid` safely as `low + (high - low) / 2` instead of `(low + high) / 2` to prevent 32-bit signed integer overflow.' },
        { lineRange: 'Line 13-15', explanation: 'Base case match: `arr[mid] == target`. Returns the zero-based index immediately.' },
        { lineRange: 'Line 16-18', explanation: 'If `arr[mid] < target`, target lies strictly in right half. Update `low = mid + 1`.' },
        { lineRange: 'Line 19-21', explanation: 'If `arr[mid] > target`, target lies strictly in left half. Update `high = mid - 1`.' },
        { lineRange: 'Line 24', explanation: 'Loop concluded without match: returns sentinel `-1` indicating target was not present.' }
      ],
      timeComplexity: 'Best: O(1) [mid is target on first check], Average & Worst: O(log N)',
      spaceComplexity: 'Iterative: O(1) auxiliary memory space; Recursive: O(log N) stack memory.',
      inputExample: 'Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], Target: 23',
      outputExample: 'Element 23 found at index: 5',
      edgeCases: [
        'Empty array (`arr.empty()`): handles gracefully, returns -1.',
        'Single element array (`size == 1`): correctly checks `low == high`.',
        'Target smaller than smallest element or larger than largest element.',
        'Array with duplicate elements (use `std::lower_bound` / `std::upper_bound` for first/last occurrences).'
      ],
      commonMistakes: [
        'Writing `(low + high) / 2` which overflows if `low + high > INT_MAX` (2,147,483,647).',
        'Writing `while (low < high)` instead of `while (low <= high)`, missing the single-element candidate check.',
        'Applying Binary Search on unsorted collections without sorting first.'
      ]
    },
    visualization: {
      type: 'process',
      title: 'Binary Search Step-by-Step Halving Space',
      description: 'Search target = 23 in array [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]',
      steps: [
        { stepNumber: 1, title: 'Step 1: Initial Range [0 to 9]', description: 'Low = 0 (val 2), High = 9 (val 91). Mid = 4 (val 16). Since 16 < 23, discard left half (0..4). Set Low = 5.', analogy: 'Eliminate left half of the dictionary' },
        { stepNumber: 2, title: 'Step 2: Narrowed Range [5 to 9]', description: 'Low = 5 (val 23), High = 9 (val 91). Mid = 7 (val 56). Since 56 > 23, discard right half (7..9). Set High = 6.', analogy: 'Eliminate right quarter of the dictionary' },
        { stepNumber: 3, title: 'Step 3: Final Search Space [5 to 6]', description: 'Low = 5 (val 23), High = 6 (val 38). Mid = 5 (val 23). Match found! arr[5] == 23.', analogy: 'Direct match found on page!' }
      ]
    },
    keyPoints: [
      'Requires pre-sorted array in ascending or descending order.',
      'Time complexity $O(\\log N)$ vs Linear Search $O(N)$.',
      'For 1 billion items, Linear search requires ~1,000,000,000 operations; Binary search requires at most 30 comparisons!',
      'Underpins C++ STL functions `std::binary_search`, `std::lower_bound`, and `std::upper_bound`.'
    ],
    commonMistakes: [
      {
        mistake: 'Using `mid = (low + high) / 2` in competitive programming or large arrays.',
        correction: 'Always use `mid = low + (high - low) / 2` to prevent standard integer overflow.'
      }
    ],
    quickRevisionCards: [
      { front: 'What is the precondition for Binary Search?', back: 'The array/collection must be monotonic (sorted).' },
      { front: 'What is the time complexity of Binary Search on N elements?', back: 'O(log₂ N).' },
      { front: 'How many maximum comparisons are needed to search 1,048,576 (2²⁰) items?', back: 'At most 20 comparisons!' }
    ],
    practiceQuestions: [
      'Modify Binary Search to find the first occurrence index of a duplicate target (Lower Bound).',
      'How can Binary Search be applied to find the peak element in a Mountain Array?',
      'Explain "Binary Search on Answer" technique for optimization problems (e.g. Aggressive Cows / Book Allocation).'
    ]
  },

  'nephron': {
    id: 'demo-nephron',
    query: 'Explain nephron structure and filtration mechanism',
    timestamp: new Date().toISOString(),
    language: 'English',
    educationLevel: 'medical',
    responseStyle: 'technical',
    quickAnswer: 'The nephron is the microscopic structural and functional unit of the human kidney (~1 million per kidney) responsible for blood filtration, selective solute reabsorption, tubular secretion, and osmoregulation to produce urine.',
    simpleExplanation: 'Think of the nephron as a multi-stage water purification and recycling plant inside your kidneys. First, it pushes all small molecules out of your blood into a collection bowl. Then, as the fluid travels through specialized tubes, it carefully reclaims all valuable nutrients (glucose, amino acids, water, salts) back into the bloodstream while dumping excess toxins and urea into the waste drain (urine).',
    realWorldAnalogy: {
      analogy: 'Emptying your entire backpack and putting only what you need back in',
      explanation: 'Instead of picking through millions of items to find small specks of trash, the kidney dumps out *everything* small into the filtrate (Glomerular filtration). Then, along the conveyor belt (Tubules), specialized inspectors pick up your phone, wallet, keys, and water bottle (Glucose, Ions, Water) and put them back in your pocket, leaving only the actual trash (Urea, toxins) to be thrown out.',
      targetContext: 'Non-selective glomerular ultrafiltration followed by selective tubular reabsorption'
    },
    detailedExplanation: 'Each nephron is composed of two primary anatomical structures:\n1. **Renal Corpuscle (Cortex):**\n   - **Glomerulus:** A high-pressure tuft of fenestrated capillaries fed by afferent arteriole and drained by efferent arteriole.\n   - **Bowman’s Capsule:** Surrounds the glomerulus. The filtration barrier consists of fenestrated endothelium, glomerular basement membrane (GBM, negatively charged heparin sulfate), and podocyte foot processes with slit diaphragms (preventing proteinuria).\n2. **Renal Tubule System:**\n   - **Proximal Convoluted Tubule (PCT):** High brush border surface area; reabsorbs ~65% of $Na^+$, $H_2O$, $K^+$, $Cl^-$, and 100% of filtered glucose & amino acids via $Na^+$-glucose cotransporters (SGLT2).\n   - **Loop of Henle:** Creates hyperosmolar medullary gradient via Countercurrent Multiplier. Descending limb is permeable to water (aquaporins); thick ascending limb (TAL) is impermeable to water and actively transports $Na^+$-$K^+$-$2Cl^-$ (NKCC2 cotransporter).\n   - **Distal Convoluted Tubule (DCT) & Collecting Duct:** Site of hormonal regulation. Aldosterone acts on Principal cells ($Na^+$ reabsorption / $K^+$ excretion), while Antidiuretic Hormone (ADH / Vasopressin) inserts Aquaporin-2 channels for facultative water reabsorption.',
    visualization: {
      type: 'flowchart',
      title: 'Nephron Structural & Fluid Flow Pathway',
      description: 'Progressive journey of plasma filtrate from Glomerulus to Collecting Duct',
      nodes: [
        { id: 'aff', label: 'Afferent Arteriole', sublabel: 'High Pressure Inflow', icon: 'Heart', color: '#ef4444', details: 'Delivers renal arterial blood to glomerular capillary bed' },
        { id: 'glom', label: 'Glomerulus & Bowman’s', sublabel: 'Ultrafiltration Stage', icon: 'Filter', color: '#f59e0b', details: 'Net Filtration Pressure ~10 mmHg; filters GFR ~125 mL/min' },
        { id: 'pct', label: 'Proximal Tubule (PCT)', sublabel: 'Bulk Reabsorption (65-100%)', icon: 'RotateCcw', color: '#22c55e', details: 'Reabsorbs all glucose, amino acids, 65% water & NaCl' },
        { id: 'loop', label: 'Loop of Henle', sublabel: 'Medullary Osmotic Gradient', icon: 'Layers', color: '#6366f1', details: 'Desc: H2O leaves; Asc: NKCC2 pumps Na+/K+/2Cl- into interstitium' },
        { id: 'dct', label: 'Distal Tubule & Duct', sublabel: 'Hormonal Fine-Tuning', icon: 'Sliders', color: '#a855f7', details: 'Target of Aldosterone & ADH/Vasopressin for blood volume & pH' },
        { id: 'urine', label: 'Renal Pelvis / Ureter', sublabel: 'Final Excreted Urine', icon: 'Droplets', color: '#06b6d4', details: 'Excretion of urea, creatinine, excess electrolytes and metabolic acids' }
      ],
      edges: [
        { from: 'aff', to: 'glom', label: 'Renal Bloodflow' },
        { from: 'glom', to: 'pct', label: 'Glomerular Filtrate' },
        { from: 'pct', to: 'loop', label: 'Tubular Fluid' },
        { from: 'loop', to: 'dct', label: 'Hypotonic Fluid' },
        { from: 'dct', to: 'urine', label: 'Concentrated Urine' }
      ],
      steps: [
        { stepNumber: 1, title: 'Glomerular Ultrafiltration', description: 'Hydrostatic pressure forces water and dissolved solutes through the three-layer filtration barrier into Bowman’s space.', analogy: 'Initial rough sieve straining out cells and large proteins' },
        { stepNumber: 2, title: 'Obligatory PCT Reabsorption', description: 'SGLT transporters and active Na+/K+ ATPase pumps reclaim all valuable nutrients and majority of ions back to peritubular capillaries.', analogy: 'Rescuing all gold and essential supplies from the conveyor' },
        { stepNumber: 3, title: 'Countercurrent Multiplication', description: 'Loop of Henle establishes hypertonic corticomedullary osmotic gradient (300 to 1200 mOsm/L).', analogy: 'Building an osmotic sponge in kidney medulla' },
        { stepNumber: 4, title: 'Facultative Water & Electrolyte Secretion', description: 'ADH activates Aquaporin-2 in collecting ducts for water retention; intercalated cells regulate acid-base homeostasis ($H^+/HCO_3^-$).', analogy: 'Smart valves adjust final hydration based on body hydration status' }
      ]
    },
    keyPoints: [
      'Normal Glomerular Filtration Rate (GFR) is ~125 mL/min (180 Litres/day); >99% is reabsorbed, producing ~1.5 L urine/day.',
      'Filtration barrier: Fenestrated endothelium + Glomerular Basement Membrane + Podocyte Slit Diaphragms.',
      'SGLT2 inhibitors (e.g. Empagliflozin) act on the PCT to treat Type 2 Diabetes and Heart Failure.',
      'Loop diuretics (e.g. Furosemide) inhibit the NKCC2 symporter in the thick ascending limb of Henle.'
    ],
    commonMistakes: [
      {
        mistake: 'Assuming the descending limb of Loop of Henle is permeable to ions.',
        correction: 'The descending limb is permeable ONLY to water (via AQP1) and completely impermeable to NaCl, whereas the ascending limb is impermeable to water and actively transports ions.'
      }
    ],
    quickRevisionCards: [
      { front: 'What is the primary site of glucose reabsorption in the nephron?', back: 'Proximal Convoluted Tubule (PCT) via SGLT2 (90%) and SGLT1 (10%) cotransporters.' },
      { front: 'Which hormone regulates water reabsorption in collecting ducts?', back: 'Antidiuretic Hormone (ADH / Vasopressin), which stimulates Aquaporin-2 channel insertion.' },
      { front: 'What causes Albuminuria (protein in urine)?', back: 'Damage to the podocyte slit diaphragms or loss of negative charge on the glomerular basement membrane.' }
    ],
    practiceQuestions: [
      'Differentiate between Cortical nephrons and Juxtamedullary nephrons with respect to Loop of Henle length and vasa recta.',
      'Describe the Renin-Angiotensin-Aldosterone System (RAAS) and its trigger at the Juxtaglomerular Apparatus (Macula Densa).',
      'Explain why severe dehydration increases urine specific gravity and serum blood urea nitrogen (BUN) to creatinine ratio.'
    ],
    medicalDisclaimer: true
  },

  'newton-laws': {
    id: 'demo-newton-laws',
    query: 'Explain Newton’s 3 laws with everyday examples',
    timestamp: new Date().toISOString(),
    language: 'English',
    educationLevel: 'high_school',
    responseStyle: 'normal',
    quickAnswer: 'Newton’s three laws of motion describe the relationship between the forces acting on a body and its motion: 1st Law (Inertia), 2nd Law ($F = ma$), and 3rd Law (Action-Reaction).',
    simpleExplanation: '1. **1st Law (Inertia):** Things like to keep doing whatever they are already doing (sitting still or cruising) unless pushed.\n2. **2nd Law ($F = ma$):** The heavier something is, the harder you have to push it to make it speed up.\n3. **3rd Law (Action-Reaction):** Whenever you push something, it pushes right back on you with the exact same strength in the opposite direction!',
    realWorldAnalogy: {
      analogy: 'Buses, Shopping Carts, and Skateboards',
      explanation: '1. **Bus Braking (1st Law):** When a speeding bus slams on brakes, your body jerks forward because your body was moving and tries to stay in motion.\n2. **Full vs Empty Shopping Cart (2nd Law):** An empty metal shopping cart flies forward with a gentle tap, but a cart filled with 50 kg of groceries requires massive push force to accelerate.\n3. **Jumping off a Skateboard (3rd Law):** When you leap forward off a skateboard, your feet push the skateboard backward with equal force!',
      targetContext: 'Classical Newtonian Mechanics and Force Interactions'
    },
    detailedExplanation: 'Formulated by Sir Isaac Newton in *Philosophiae Naturalis Principia Mathematica* (1687):\n\n### 1. First Law (Law of Inertia)\nAn object remains at rest or in uniform motion along a straight line unless acted upon by a net external resultant force:\n$$\\sum \\vec{F} = 0 \\implies \\frac{d\\vec{v}}{dt} = 0$$\n\n### 2. Second Law (Law of Momentum & Force)\nThe net external force on a body is directly proportional to the rate of change of its linear momentum $\\vec{p} = m\\vec{v}$:\n$$\\vec{F}_{\\text{net}} = \\frac{d\\vec{p}}{dt} = m\\vec{a} \\quad (\\text{for constant mass } m)$$\n\n### 3. Third Law (Law of Action and Reaction)\nWhen body A exerts a force on body B ($\\vec{F}_{AB}$), body B simultaneously exerts an equal and opposite force on body A ($\\vec{F}_{BA}$):\n$$\\vec{F}_{AB} = -\\vec{F}_{BA}$$',
    visualization: {
      type: 'flowchart',
      title: 'Newton’s 3 Laws of Motion Overview',
      description: 'Inertia, Force-Acceleration, and Mutual Pair Interactions',
      nodes: [
        { id: 'law1', label: '1st Law: Inertia', sublabel: 'No Force → Constant Velocity', icon: 'Shield', color: '#6366f1', details: 'Objects resist change in their state of rest or motion' },
        { id: 'law2', label: '2nd Law: F = ma', sublabel: 'Force = Mass × Acceleration', icon: 'TrendingUp', color: '#22c55e', details: 'Acceleration is directly proportional to force and inversely to mass' },
        { id: 'law3', label: '3rd Law: Action-Reaction', sublabel: 'F_A = - F_B (Mutual Pairs)', icon: 'ArrowRightLeft', color: '#f59e0b', details: 'Forces always occur in simultaneous pairs acting on two different bodies' }
      ],
      steps: [
        { stepNumber: 1, title: 'Law 1 in Action (Inertia)', description: 'A hockey puck glides infinitely across frictionless ice without slowing down.', analogy: 'Objects are stubborn; they resist changing speed.' },
        { stepNumber: 2, title: 'Law 2 in Action (F = ma)', description: 'Doubling the thrust of a rocket doubles its rate of acceleration (for constant mass).', analogy: 'Bigger engine pushes the same car much faster.' },
        { stepNumber: 3, title: 'Law 3 in Action (Action-Reaction)', description: 'Rocket engines blast hot combustion gas downward; the escaping gas pushes the rocket upward into space.', analogy: 'Swimmer pushing water backward to surge forward.' }
      ]
    },
    keyPoints: [
      'Mass is a quantitative measure of an object’s inertia.',
      'Force is a vector quantity measured in Newtons ($1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$).',
      'Action and Reaction forces **never cancel each other out** because they act on two entirely distinct bodies!'
    ],
    commonMistakes: [
      {
        mistake: 'Thinking action and reaction forces cancel out to zero net force.',
        correction: 'Forces can only cancel if they act on the SAME object. Action and reaction act on two DIFFERENT objects (e.g. Foot pushes Ball forward; Ball pushes Foot backward).'
      },
      {
        mistake: 'Thinking force is required to keep an object in continuous uniform motion.',
        correction: 'By the 1st Law, NO net force is needed to maintain constant velocity; force is only required to change velocity (accelerate or overcome friction).'
      }
    ],
    quickRevisionCards: [
      { front: 'What is the SI unit of Force and its base unit breakdown?', back: 'Newton (N), equivalent to kg·m/s².' },
      { front: 'Why do passengers lean outward when a car takes a sharp curve?', back: 'Due to centrifugal sensation caused by Inertia of Direction (body attempts to continue in a straight line).' },
      { front: 'Why do action-reaction forces not cancel each other?', back: 'Because they act on two different bodies, not on the same body.' }
    ],
    practiceQuestions: [
      'A 1200 kg car accelerates from rest to 20 m/s in 5 seconds. Calculate the net force exerted on the car.',
      'Why does a cricket fielder pull his hands backward while catching a fast cricket ball (impulse-momentum theorem)?',
      'Draw the free body diagram (FBD) of a person standing inside an elevator accelerating upward at $2\\text{ m/s}^2$.'
    ]
  }
};
