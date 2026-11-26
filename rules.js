// Generated from the Android app's Faults.kt so the website and app tag listings the same way.
const rx = p => new RegExp(p, 'i');

export const RULES = [
  { label: "Powers on", level: 'EASY', re: rx("powers on|turns on (fine|ok|okay|normally)|switches on (fine|ok)|boots (up|fine|ok|to)|loads (up|to)|works (fine|perfectly|ok)|detected in"), kinds: ["CONSOLE", "CONTROLLER", "GPU", "LAPTOP"] },
  { label: "HDMI", level: 'EASY', re: rx("hdmi|no display|no picture|no signal|no video|no image|no output"), kinds: ["CONSOLE"] },
  { label: "Port damage", level: 'EASY', re: rx("(hdmi|display ?port|dp|usb-?c?) (port|socket)|(port|socket) (broken|damaged|bent|loose)|bent pins?"), kinds: ["GPU", "LAPTOP"] },
  { label: "Fan / noise", level: 'EASY', re: rx("fans? (noise|noisy|issue|fault|problem|broken|not|making|loud|rattl|grind|error)|(broken|faulty|noisy|loud|dead|missing) fans?|noisy|\\bloud\\b|grinding|rattl|coil whine"), kinds: ["CONSOLE", "CONTROLLER", "GPU", "LAPTOP"] },
  { label: "Software", level: 'EASY', re: rx("safe mode|boot ?loop|update (error|fail)|stuck on|rest mode|error code|\\bce-?\\d{5}|\\be10\\d\\b|\\be20\\d\\b|needs? (a )?reset|bitlocker|driver (issue|crash|error)"), kinds: ["CONSOLE", "CONTROLLER", "GPU", "LAPTOP"] },
  { label: "Disc drive", level: 'EASY', re: rx("dis[ck] drive|won'?t read|not reading|doesn'?t read|\\beject|dis[ck]s? (issue|fault|problem|not)"), kinds: ["CONSOLE"] },
  { label: "Screen", level: 'EASY', re: rx("(screen|lcd|panel|display) (crack|broken|damaged|smashed|lines|flicker|dead|black|issue|fault|problem)|(cracked|broken|damaged|smashed|bad|dim) (screen|lcd|panel|hinge|lid)|backlight|hinge"), kinds: ["LAPTOP"] },
  { label: "Keyboard", level: 'EASY', re: rx("(keyboard|keys?|trackpad|touchpad) (not|broken|missing|faulty|issue|fault|damaged|sticky|dead)|(missing|broken|sticky) keys?|(faulty|broken|damaged) (keyboard|trackpad|touchpad)"), kinds: ["LAPTOP"] },
  { label: "Cosmetic", level: 'EASY', re: rx("scratch|cosmetic|\\bdent|broken (stand|cover|faceplate|plate|feet|foot|shroud|backplate)|cracked (case|shell|plastic)"), kinds: ["CONSOLE", "CONTROLLER", "GPU", "LAPTOP"] },
  { label: "Stick drift", level: 'EASY', re: rx("drift|joy ?stick|thumb ?stick|analog(ue)? stick"), kinds: ["CONTROLLER"] },
  { label: "Buttons / triggers", level: 'EASY', re: rx("button|trigger|bumper|\\b[lr][12]\\b|adaptive|sticky|not clicking"), kinds: ["CONTROLLER"] },
  { label: "Charging", level: 'EASY', re: rx("charg|usb"), kinds: ["CONTROLLER"] },
  { label: "Charging", level: 'EASY', re: rx("not charging|won'?t charge|doesn'?t charge|charging (port|issue|fault|problem)|charge port|dc ?jack|power jack"), kinds: ["LAPTOP"] },
  { label: "Connection", level: 'MAYBE', re: rx("connect|\\bpair|bluetooth|\\bsync"), kinds: ["CONTROLLER"] },
  { label: "Battery", level: 'MAYBE', re: rx("batter(y|ies)|won'?t hold"), kinds: ["CONTROLLER", "LAPTOP"] },
  { label: "No display", level: 'MAYBE', re: rx("no display|no picture|no signal|no video|no image|no output|black screen|code ?43|not detected|no post\\b"), kinds: ["GPU", "LAPTOP"] },
  { label: "Artifacts", level: 'MAYBE', re: rx("artif|artef|glitch|lines on|flicker|corrupt|crash|vram|memory (error|fault)|bsod|blue screen"), kinds: ["GPU", "LAPTOP"] },
  { label: "Burnt", level: 'MAYBE', re: rx("burn|scorch|smell|melt|blown|shorted|short circuit|dead short|smoked|smoking"), kinds: ["GPU", "LAPTOP"] },
  { label: "Ex-mining", level: 'MAYBE', re: rx("mining|miner|mined"), kinds: ["GPU"] },
  { label: "No power", level: 'MAYBE', re: rx("no power|\\bdead\\b|won'?t (turn|power|switch|boot)|doesn'?t (turn|power|switch|boot)|not (turning|powering|switching|booting)|won'?t start|no lights?\\b|no fans? spin|fans? (don'?t|doesn'?t|won'?t) spin"), kinds: ["CONSOLE", "CONTROLLER", "GPU", "LAPTOP"] },
  { label: "Light of death", level: 'MAYBE', re: rx("(blue|white|orange) light|\\bbl(o)?d\\b"), kinds: ["CONSOLE"] },
  { label: "Overheating", level: 'MAYBE', re: rx("over ?heat|shut(s|ting)? (off|down)|turns? (itself )?off|switch(es)? off|thermal|throttl|hot spot|hotspot"), kinds: ["CONSOLE", "CONTROLLER", "GPU", "LAPTOP"] },
  { label: "Storage / SSD", level: 'MAYBE', re: rx("\\bssd\\b|hard ?drive|\\bhdd\\b|storage"), kinds: ["CONSOLE"] },
  { label: "No SSD / RAM", level: 'MAYBE', re: rx("no (ssd|hdd|hard ?drive|ram|memory|storage|charger|os)\\b|without (an? )?(ssd|hdd|ram|charger)|(ssd|ram|hdd) removed"), kinds: ["LAPTOP"] },
  { label: "Liquid", level: 'MAYBE', re: rx("liquid|water damage|spill|\\bwet\\b"), kinds: ["CONSOLE", "CONTROLLER", "GPU", "LAPTOP"] },
  { label: "Untested", level: 'MAYBE', re: rx("untested|unknown fault|not tested|no (cables|leads|power (cable|lead))"), kinds: ["CONSOLE", "CONTROLLER", "GPU", "LAPTOP"] },
  { label: "Banned / locked", level: 'RISKY', re: rx("\\bban(ned)?\\b|blacklist|\\blocked\\b|bios (lock|password)|password (locked|protected)|computrace|icloud"), kinds: ["CONSOLE", "CONTROLLER", "GPU", "LAPTOP"] },
  { label: "Parts missing", level: 'RISKY', re: rx("(mother)?board only|shell only|case only|housing only|no (ssd|hdd|hard ?drive|motherboard|board|apu|ram|chip|nand)\\b|missing (parts|board|motherboard|apu|chips?|ram|ssd|nand)|stripped|(apu|chips?|ram|nand|ssd) (removed|missing)"), kinds: ["CONSOLE", "CONTROLLER"] },
  { label: "Parts missing", level: 'RISKY', re: rx("(core|gpu|die|vram|memory chips?|chips?) (removed|missing)|no (core|gpu|die)\\b|pcb only|for parts only.*(no|missing)|stripped"), kinds: ["GPU"] },
  { label: "Parts missing", level: 'RISKY', re: rx("(mother)?board only|no (motherboard|board|screen|gpu)\\b|(motherboard|gpu|cpu|screen) (removed|missing)|stripped|shell only|chassis only"), kinds: ["LAPTOP"] },
];

export const faultContext = rx("fault|issue|problem|not work|n'?t work|does ?n'?t|won'?t|wont|can'?t|cannot|broken|error|spares|repair|\\bdead\\b|no (power|display|picture|signal|video|sound)|stopped|fails?|failed|faulty|damage|drift|sticky|untested|not tested|light|overheat|shuts?|turns? (off|on)|powers? (on|off)|boots?|hdmi|fan|noise|liquid|water|banned|missing|crack|tested|working|as seen|reason for|selling (as|because)|artif|artef|code ?43|post|detected|screen|keyboard|burn|vram|thermal|temps?\\b");
export const boilerplate = rx("postage|shipping|dispatch|delivery|courier|payment|paypal|return|refund|feedback|bank holiday|collection only|please message|smoke[- ]free|pet[- ]free|\\bpets?\\b|\\bcats?\\b|\\bdogs?\\b|\\bvat\\b|invoice|bid only if|serious buyers|timewasters");
export const justSpares = rx("[\\w\\s]{0,25}(spares|parts)\\s*(or|and|&|/)\\s*repairs?[\\w\\s.!]{0,20}");
export const negated = rx("(n'?t|not|never|no longer|won'?t|wont|unable to|fails? to|can'?t)\\s+(\\w+\\s+){0,2}(power|turn|switch|boot|load|work)");
export const alwaysJunk = rx("empty box|box only|face ?plates?|cover plates?|\\bskins?\\b|charging (station|dock)");
export const consoleWords = rx("console|dis[ck] edition|digital edition|\\b[12] ?tb\\b|\\b(512|825) ?gb\\b|\\bslim\\b|\\bbundle\\b");
export const startsWithAccessory = rx("^\\W*(new |genuine |official |sony |microsoft |wireless |white |black )*(dualsense|controller|headset|camera|media remote|remote|charger|stand|cooling)");
export const forConsole = rx("\\b(for|compatible with|fits)\\s+(the\\s+)?(sony\\s+|microsoft\\s+)?(ps5|playstation|xbox)");
export const padWords = rx("controller|dual ?sense|joy ?pad|game ?pad|\\bpads?\\b");
export const comesWithPad = rx("(with|w/|and|&|\\+|plus|inc\\.?|incl\\.?|includes?|including|x ?2|two|2x?)\\s*(\\d\\s*)?(x\\s*)?(official\\s+|wireless\\s+|white\\s+|black\\s+)?(controllers?|dual ?sense|pads?)");
export const repairService = rx("\\bservices?\\b|\\bservicing\\b|mail[- ]?in|post[- ]?in|send (it |yours |your \\w+ )?(in|to us)|we (will |can )?(repair|fix|replace|diagnose)|(repair|fix|replace|reflow|reball|recap)(ing)? your|(repair|replacement|fitting|reflow|reball|reballing|diagnostic|labour|labor)\\s+(only|charge|fee)\\b|turnaround|same[- ]day (repair|fix)|\\d+[- ]?(month|day|year)s? (repair )?warranty on (the )?(repair|work)|professional (repair|fix)|uk (based )?repair (centre|center|shop)");
export const pcJunk = rx("empty box|box only|(screen|lcd|keyboard|battery|charger|adapter|backplate|shroud|bracket|cooler|heatsink|fans?|case|shell|lid|palm ?rest|hinges?|cable) only|charger for|adapter for|replacement (fan|screen|keyboard|battery|cooler)|water ?block|riser|fan for|cooler for|bracket for|\\bfor (asus|msi|gigabyte|zotac|palit|evga|nvidia|dell|hp|lenovo|acer|razer)\\b.*\\b(fan|cooler|screen|keyboard|battery|charger|heatsink)");
