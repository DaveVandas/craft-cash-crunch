export interface WealthStory {
  title: string;
  subtitle: string;
  image: string;
  intro: string;
  story: string;
  quote: string;
  lessons: string[];
  tags: string[];
}

export const WEALTH_STORIES: WealthStory[] = [
  {
    title: "From Homeless to Billionaire: The Howard Schultz Story",
    subtitle: "How a kid from the projects built a $100B coffee empire",
    image: "☕",
    intro: "Growing up in the Brooklyn projects, Howard Schultz never imagined he'd one day run one of the most valuable brands on Earth.",
    story: `Howard Schultz was born in 1953 in the Bayview Housing Projects of Brooklyn, New York. His father was a truck driver who never earned more than $20,000 a year. When Howard was seven, his father broke his ankle at work and lost his job — with no health insurance, no worker's compensation, and no safety net.

That moment of seeing his family's vulnerability shaped everything that followed.

**The Turning Point**

Schultz became the first in his family to attend college, earning a football scholarship to Northern Michigan University. After graduating, he worked his way up in sales before discovering a small coffee bean company in Seattle called Starbucks.

In 1982, he joined as Director of Marketing. But he had a bigger vision — he wanted to transform it from a bean seller into an Italian-style espresso bar experience.

The founders said no.

**Betting Everything**

So Schultz left and started his own coffee company, Il Giornale. He pitched to 242 investors. 217 said no. But he kept going.

In 1987, he bought Starbucks for $3.8 million with help from local investors. His vision? Create a "third place" between work and home where people could connect.

**The Empire**

Today, Starbucks has over 35,000 stores in 80+ countries, and Schultz's net worth exceeds $4.5 billion. But perhaps more importantly, he revolutionized how American companies treat employees — offering health insurance and stock options even to part-time workers.

"I wanted to build the kind of company my father never got to work for."`,
    quote: "In life, you can blame a lot of people and you can wallow in self-pity, or you can pick yourself up and say, 'Listen, I have to be responsible for myself.'",
    lessons: [
      "Your background doesn't define your ceiling",
      "When investors say no, find different investors",
      "Build the company you wish existed",
      "Take care of people, and they'll take care of your business"
    ],
    tags: ["Entrepreneur", "Starbucks", "Perseverance"]
  },
  {
    title: "Sleeping in His Car to Sleeping on Money: Jay-Z's Billion Dollar Journey",
    subtitle: "From Marcy Projects to hip-hop's first billionaire",
    image: "🎤",
    intro: "Shawn Corey Carter grew up in a housing project where drug dealers were the only visible millionaires. He chose a different path to the top.",
    story: `In the Marcy Houses of Brooklyn, young Shawn Carter watched his neighborhood crumble around him. His father left when he was 11. Drug dealers drove nice cars while working people struggled. For a while, he took what seemed like the only path available.

But he had another talent: words.

**The Hustle Transforms**

Jay-Z's rap sheets turned into rap verses. He started recording in the late '80s, but no record label would sign him. So in 1995, with partners Damon Dash and Kareem "Biggs" Burke, he did something unheard of — he started his own label, Roc-A-Fella Records.

They sold CDs out of car trunks. They hustled like their lives depended on it — because in many ways, they did.

**Building an Empire**

"Reasonable Doubt" dropped in 1996. It changed everything. But Jay-Z wasn't just making music — he was building businesses.

Rocawear clothing line? Sold for $204 million.
Part ownership of the Brooklyn Nets? Leveraged that into Barclays Center naming rights negotiations.
Tidal streaming service? Sold majority stake to Square for $297 million.
Armand de Brignac champagne? Sold 50% to LVMH for estimated $300+ million.

**The Billionaire Blueprint**

In 2019, Forbes declared Jay-Z hip-hop's first billionaire. His net worth? Over $2.5 billion today.

But here's what most people miss: Jay-Z didn't just get rich from music. He studied finance. He surrounded himself with smart money people. He owned masters, not just made music.

"I'm not a businessman, I'm a business, man."`,
    quote: "I will not lose, for even in defeat, there's a valuable lesson learned, so it evens up for me.",
    lessons: [
      "Own your masters (and your intellectual property)",
      "Diversify into businesses you understand",
      "Surround yourself with people smarter than you in areas you're weak",
      "Never let your past define your future"
    ],
    tags: ["Music", "Entrepreneurship", "Investing"]
  },
  {
    title: "From Welfare to Worth Billions: Oprah's Unbreakable Rise",
    subtitle: "How a teenage runaway became America's most powerful media mogul",
    image: "📺",
    intro: "Born to an unmarried teenage mother in rural Mississippi, Oprah Winfrey's early life was a series of traumas that would break most people.",
    story: `Oprah was born into poverty in Kosciusko, Mississippi in 1954. She wore dresses made of potato sacks. She was raised by her grandmother until age 6, then bounced between her mother in Milwaukee and her father in Nashville.

She was abused by family members starting at age 9. At 14, she became pregnant (the child died shortly after birth). She ran away from home. She was sent to juvenile detention.

**The Voice Emerges**

But something remarkable happened when Oprah discovered her voice. At age 17, she won a local beauty pageant. At 19, she became the youngest — and first Black female — news anchor at Nashville's WLAC-TV.

She wasn't just good at her job. She was *different*. She connected with people. She made them feel seen.

**Building Harpo**

In 1986, The Oprah Winfrey Show went national. Within a year, it was the highest-rated talk show in America.

But Oprah didn't just host. She negotiated ownership. In 1988, she founded Harpo Productions, becoming only the third woman in American history to own her own major studio.

The show ran for 25 seasons, generating over $2 billion in revenue.

**The Empire Expands**

OWN (Oprah Winfrey Network) — $70 million deal with Discovery
Weight Watchers investment — turned $43 million into $400 million
O Magazine — 2+ million subscribers at peak
Book Club recommendations — could add $30 million to a book's sales overnight

**Today**

Oprah's net worth exceeds $2.5 billion. She's given away over $400 million to charitable causes. She built a school in South Africa.

From potato sack dresses to literal billions.`,
    quote: "The biggest adventure you can ever take is to live the life of your dreams.",
    lessons: [
      "Your trauma doesn't have to define you",
      "Own your platform, don't just appear on it",
      "Authenticity is your superpower",
      "Use success to lift others"
    ],
    tags: ["Media", "Self-Made", "Philanthropy"]
  },
  {
    title: "Rejected 1,009 Times: Colonel Sanders' Late-Game Victory",
    subtitle: "How a 65-year-old turned a recipe and a Social Security check into a $15B empire",
    image: "🍗",
    intro: "Most 65-year-olds are thinking about retirement. Harland Sanders was just getting started.",
    story: `By age 65, Harland Sanders had failed at pretty much everything. He'd been a farmhand, a streetcar conductor, a railroad fireman (fired for fighting), a lawyer (lost his practice after a courtroom brawl), an insurance salesman (fired), a tire salesman, a gas station operator, and a motel owner.

When the interstate bypassed his restaurant in Corbin, Kentucky, he was left with nothing but a Social Security check for $105 and a recipe for fried chicken.

**The 1,009 Rejections**

At an age when most people give up, Sanders put on his white suit, loaded his car with a pressure cooker and his secret blend of 11 herbs and spices, and hit the road.

He drove from restaurant to restaurant, cooking his chicken for owners, asking them to franchise his recipe in exchange for a nickel per chicken sold.

He slept in his car. He heard "no" over and over. Legend says he was rejected 1,009 times before a restaurant in Salt Lake City said yes.

**From Zero to Empire**

By 1964, Sanders had 600 franchised outlets. That year, he sold Kentucky Fried Chicken for $2 million ($19 million today) — though he stayed on as spokesman until his death.

Today, KFC has 27,000 locations in 145 countries, generating over $30 billion in annual sales.

**The Lesson**

Sanders didn't succeed despite his age. He succeeded because of a lifetime of failure that taught him exactly how to make chicken — and exactly how to never give up.`,
    quote: "I made a resolve then that I was going to amount to something if I could. And no hours, nor amount of labor, nor amount of money would deter me.",
    lessons: [
      "It's never too late to start",
      "Every failure teaches you something",
      "Persistence beats talent when talent doesn't persist",
      "Age is just a number if your fire is still burning"
    ],
    tags: ["Late Bloomer", "Persistence", "Franchise"]
  },
  {
    title: "From $7.50/Hour to Billionaire: Sara Blakely's Spanx Story",
    subtitle: "How a fax machine saleswoman invented a billion-dollar industry",
    image: "👗",
    intro: "Sara Blakely was selling fax machines door-to-door, earning $7.50 an hour. One night, cutting the feet off her pantyhose changed everything.",
    story: `Sara Blakely's journey to becoming the youngest self-made female billionaire started with a simple frustration: her pants didn't look right with regular pantyhose.

**The $5,000 Gamble**

In 1998, Sara had saved $5,000 from selling fax machines. She invested every penny into creating footless pantyhose — a product that didn't exist.

She couldn't afford a lawyer, so she wrote her own patent by reading textbooks. Manufacturers laughed at her. She got rejected by every hosiery mill she approached.

Finally, one factory owner agreed — not because of the pitch, but because his daughters said it was a great idea.

**Breaking Into Retail**

Sara drove to Neiman Marcus, talked her way into a buyer meeting, and literally put on the product in the bathroom to demonstrate the difference. She got her first order.

She packed products herself. She worked nights and weekends. She didn't take a salary for years.

**The Oprah Effect**

When Oprah named Spanx one of her "Favorite Things" in 2000, sales exploded. But Sara had already been grinding for two years before that moment.

**Today**

Sara sold a majority stake of Spanx in 2021, valuing the company at $1.2 billion. She gave every employee two first-class plane tickets and $10,000 cash to celebrate.

From $5,000 to $1.2 billion. From fax machines to fashion empire.`,
    quote: "It's important to be willing to make mistakes. The worst thing that can happen is you become memorable.",
    lessons: [
      "Start with the money you have, not the money you want",
      "Persistence beats perfection every time",
      "Learn skills yourself when you can't afford to hire them",
      "Success often comes after years of invisible grinding"
    ],
    tags: ["Self-Made", "Fashion", "Persistence"]
  },
  {
    title: "The Immigrant Who Built a $70 Billion Empire: Do Won Chang",
    subtitle: "From janitor to Forever 21 founder",
    image: "🛍️",
    intro: "Do Won Chang arrived in America with almost nothing. He worked three jobs simultaneously. Twenty years later, he owned one of the world's largest fashion retailers.",
    story: `In 1981, Do Won Chang immigrated to Los Angeles from South Korea with his wife and daughters. He didn't speak English. He had no connections. He had almost no money.

**The Grind**

To survive, he worked three jobs at once: janitor, gas station attendant, and coffee shop worker. He worked from 6 AM to midnight, seven days a week.

But he was watching. Learning. He noticed that the people driving the nicest cars weren't doctors or lawyers — they were in the clothing business.

**Fashion 21**

In 1984, with savings from years of grinding, Do Won and his wife Jin Sook opened a small clothing store in Highland Park, LA. They called it Fashion 21.

First year sales: $700,000. The store was just 900 square feet.

The secret? Affordable fashion that looked like expensive runway styles. They could spot trends and get products on shelves in weeks, not months.

**The Empire Grows**

Fashion 21 became Forever 21. One store became hundreds. The company grew to over 800 stores in 57 countries at its peak.

At its height, Forever 21 generated $4.4 billion in annual revenue. The Chang family's net worth reached $6 billion.

**The Lesson**

Do Won Chang often says: "I am very thankful that I came to this country with almost nothing, because having almost nothing makes you hungry."`,
    quote: "America is still the land of opportunity. Work hard, stay focused, be patient.",
    lessons: [
      "Immigrant hunger can be a superpower",
      "Work multiple jobs to learn multiple industries",
      "Watch what successful people do, not just what they say",
      "Speed and adaptation beat slow perfection"
    ],
    tags: ["Immigrant Story", "Retail", "Hard Work"]
  },
  {
    title: "Rejected from 30 Jobs: Jack Ma's Journey to $40 Billion",
    subtitle: "How China's most famous failure built Alibaba",
    image: "📱",
    intro: "Jack Ma failed his college entrance exam twice. He was rejected from 30 jobs including KFC. He started an internet company without knowing anything about technology.",
    story: `Before becoming one of China's richest men, Jack Ma collected failures like trophies.

**The Rejection Collector**

- Failed his college entrance exam twice
- Rejected from Harvard 10 times
- Applied to 30 jobs after college, rejected from all of them
- KFC came to his town, 24 people applied, 23 got hired — he was the one rejection
- Applied to be a police officer — rejected

**Finding the Internet**

In 1995, at age 31, Jack Ma visited the United States and saw the internet for the first time. He typed "beer" into a search engine. Results came from America, Germany, Japan — but nothing from China.

He saw opportunity where others saw nothing.

**The Garage Years**

Back in China, Jack gathered 17 friends into his apartment. He raised $60,000 — pooling everyone's life savings. They built Alibaba.

For years, they didn't pay themselves. They ate instant noodles. They slept on the floor.

**The Empire**

Alibaba became the world's largest e-commerce company. At its peak, the company was worth over $800 billion. Jack Ma's personal net worth reached $40 billion.

The man rejected by KFC now owns companies that employ over 250,000 people.

**His Famous Words**

"If you don't give up, you still have a chance. Giving up is the greatest failure."`,
    quote: "Today is hard, tomorrow will be worse, but the day after tomorrow will be sunshine.",
    lessons: [
      "Rejection is just redirection",
      "You don't need to understand technology to build tech companies",
      "Start with people who believe in you, not credentials",
      "Your biggest asset is your ability to not give up"
    ],
    tags: ["Tech", "Perseverance", "Alibaba"]
  },
  // === NEW STORIES BELOW ===
  {
    title: "From Foster Care to Fashion Icon: Ralph Lauren's American Dream",
    subtitle: "A Bronx kid who couldn't afford clothes built a $9B fashion empire",
    image: "👔",
    intro: "Ralph Lifshitz grew up sharing a room with two brothers in a tiny Bronx apartment. He bought his own clothes with money from part-time jobs because his family couldn't afford them.",
    story: `Ralph Lauren never attended fashion school. He never sketched a design in his life. What he had was a vision of how people wanted to feel.

**Starting Small**

After a stint in the Army, Ralph got a job selling ties. But he didn't want to sell other people's ties — he wanted to create his own. In 1967, he borrowed $50,000 to start a necktie business.

His ties were wider than what was fashionable. Stores said no. Bloomingdale's gave him a shot — but told him to remove his label. He refused and walked away.

**The Brand Is Born**

He went back to Bloomingdale's with his own terms. They agreed. Polo Ralph Lauren was born.

**Building a Lifestyle**

Ralph didn't just sell clothes. He sold a lifestyle — the idea of American elegance. He was the first designer to have his own in-store shop inside a department store. He created entire worlds through his stores.

**The Empire**

Today, Ralph Lauren Corporation generates over $6 billion in revenue. Ralph's personal net worth exceeds $9 billion. The kid from the Bronx who couldn't afford clothes now dresses the world.`,
    quote: "I don't design clothes. I design dreams.",
    lessons: [
      "Sell a feeling, not just a product",
      "Never compromise your brand for a quick win",
      "You don't need formal training to disrupt an industry",
      "Vision matters more than credentials"
    ],
    tags: ["Fashion", "Branding", "Self-Made"]
  },
  {
    title: "The Dyslexic Billionaire: Richard Branson's Wild Ride",
    subtitle: "How a high school dropout built 400+ companies worth $5B",
    image: "🚀",
    intro: "Richard Branson couldn't read well, dropped out at 16, and his headmaster told him he'd either end up in prison or become a millionaire.",
    story: `Richard Branson's learning disability made school a nightmare. He couldn't keep up with reading. Tests were torture. At 16, he dropped out to start a student magazine.

**The First Hustle**

His magazine led to a mail-order record business, which led to a record shop, which led to Virgin Records. He signed Mike Oldfield, whose "Tubular Bells" became a massive hit.

Then he signed the Sex Pistols when no one else would touch them.

**Going Bigger**

Branson launched Virgin Atlantic in 1984 with a single leased 747. British Airways tried to destroy him. He fought back and won a landmark lawsuit.

Airlines, mobile phones, gyms, hotels, space travel — Branson launched over 400 companies under the Virgin brand.

**The Space Race**

Virgin Galactic became the first commercial spaceline to send passengers to space. Branson himself flew to the edge of space in 2021.

**Today**

Net worth: over $5 billion. Companies in 35 countries. All from a kid who couldn't read his own textbooks.`,
    quote: "Screw it, let's do it.",
    lessons: [
      "Your disability can become your superpower",
      "If someone says no, there's always a way around it",
      "Brand is everything — protect it fiercely",
      "Adventure and business aren't opposites"
    ],
    tags: ["Entrepreneur", "Virgin", "Adventure"]
  },
  {
    title: "Bankrupt to Billions: Walt Disney's Magical Comeback",
    subtitle: "How a man who went broke created the happiest place on Earth",
    image: "🏰",
    intro: "Before Mickey Mouse, Walt Disney was a broke artist whose first company went bankrupt and whose first successful character was stolen from him.",
    story: `Walt Disney's first animation company, Laugh-O-Gram Studio, went bankrupt in 1923. He was so broke he ate dog food to survive.

**The Betrayal**

He moved to Hollywood and created Oswald the Lucky Rabbit — a huge hit. But his distributor stole the character and hired away most of his animators. Walt lost everything again.

**The Mouse**

On a train ride home from that devastating meeting, Walt sketched a little mouse. His wife named it Mickey.

In 1928, "Steamboat Willie" premiered — the first cartoon with synchronized sound. Mickey Mouse became a phenomenon.

**The Impossible Dream**

Everyone said a full-length animated film was impossible — they called it "Disney's Folly." Snow White and the Seven Dwarfs opened in 1937 and earned $8 million (equivalent to $170 million today).

Then came Disneyland. Bankers said no. His brother Roy said no. His wife said no. He mortgaged everything, including his life insurance.

**The Legacy**

The Walt Disney Company is now worth over $170 billion. Disney parks host over 150 million visitors annually. All because a broke artist refused to stop dreaming.`,
    quote: "All our dreams can come true, if we have the courage to pursue them.",
    lessons: [
      "Bankruptcy isn't the end — it's a plot twist",
      "When someone steals your work, create something better",
      "Bet on yourself when nobody else will",
      "The biggest risks create the biggest legacies"
    ],
    tags: ["Entertainment", "Creativity", "Comeback"]
  },
  {
    title: "From a Garage to $3 Trillion: Steve Jobs and Apple",
    subtitle: "Fired from his own company, then built the most valuable brand in history",
    image: "🍎",
    intro: "Steve Jobs was adopted, dropped out of college, and got fired from the company he founded. Then he came back and changed the world.",
    story: `Steve Jobs was given up for adoption at birth. His biological father was a Syrian immigrant. His adoptive parents were working-class.

**The Garage**

In 1976, Steve and Steve Wozniak built the first Apple computer in a garage. They sold Steve's VW van and Woz's calculator to fund it.

Apple grew fast. By 26, Jobs was worth $250 million.

**The Firing**

In 1985, Apple's board fired Jobs from his own company. He was devastated. "I felt that I had let the previous generation of entrepreneurs down," he said.

**The Wilderness Years**

Jobs started NeXT Computer and bought a small animation studio from George Lucas. That studio became Pixar, which produced Toy Story and was eventually sold to Disney for $7.4 billion.

**The Return**

In 1997, Apple was 90 days from bankruptcy. They bought NeXT and Jobs came back. Then came iMac. iPod. iPhone. iPad.

**The Legacy**

Apple became the first company to reach $3 trillion in value. Jobs, who died in 2011, is considered one of the greatest innovators in human history.`,
    quote: "Stay hungry, stay foolish.",
    lessons: [
      "Getting fired can be the best thing that happens to you",
      "The wilderness years teach you the most",
      "Simplicity is the ultimate sophistication",
      "Connect the dots looking backward, not forward"
    ],
    tags: ["Tech", "Apple", "Innovation"]
  },
  {
    title: "The Hairdresser Who Built a Billion-Dollar Brand: Madam C.J. Walker",
    subtitle: "America's first self-made female millionaire started with $1.50",
    image: "💇‍♀️",
    intro: "Born to former slaves in 1867, Sarah Breedlove — later known as Madam C.J. Walker — became the first self-made female millionaire in American history.",
    story: `Sarah Breedlove was orphaned at 7, married at 14, and widowed at 20 with a young daughter. She worked as a washerwoman for $1.50 a day.

**The Problem**

Stress and poor diet caused her hair to fall out. She began experimenting with homemade remedies and commercial treatments.

**The Solution**

She developed her own line of hair care products specifically for Black women — a market completely ignored by every major company.

**Door to Door**

Walker sold her products door-to-door, gave demonstrations in churches and women's clubs, and trained other Black women as sales agents — creating one of the first multilevel marketing empires.

**The Empire**

By 1910, she had moved to Indianapolis and built a factory, hair salon, and training school. She employed over 3,000 people. She became the wealthiest self-made woman in America.

She also became one of the most generous philanthropists of her era, donating to schools, orphanages, and civil rights organizations.

**The Legacy**

Walker's net worth at her death in 1919 would be equivalent to roughly $10 million today. But her real legacy was proving that a Black woman born to slaves could build an empire through innovation, hard work, and serving her community.`,
    quote: "I am a woman who came from the cotton fields of the South. From there I was promoted to the washtub. Then I promoted myself into the business of manufacturing hair goods.",
    lessons: [
      "Serve a market that everyone else ignores",
      "Your customer base is your community",
      "Empower others and you empower yourself",
      "The best businesses solve real problems"
    ],
    tags: ["Pioneer", "Beauty", "Civil Rights"]
  },
  {
    title: "From Sleeping on Floors to $200 Billion: Jeff Bezos and Amazon",
    subtitle: "How a hedge fund VP risked everything on selling books online",
    image: "📦",
    intro: "Jeff Bezos had a comfortable job on Wall Street making great money. He quit to sell books out of his garage. His parents invested their life savings.",
    story: `In 1994, Jeff Bezos was a VP at D.E. Shaw, a prestigious hedge fund. He was 30, married, and making good money. Then he read a statistic: the internet was growing at 2,300% per year.

**The Regret Minimization Framework**

Bezos created what he called the "regret minimization framework." He imagined himself at 80 years old. Would he regret not trying? The answer was obvious.

He quit his job, drove to Seattle, and started Amazon in his garage.

**The Early Days**

His parents invested $245,000 — most of their life savings. He told them there was a 70% chance they'd lose everything.

Amazon launched as an online bookstore in 1995. In the early days, Bezos personally drove packages to the post office.

**The Long Game**

Amazon didn't turn a profit for nearly seven years. Wall Street called it "Amazon.bomb." Bezos ignored them and kept reinvesting.

He expanded from books to everything. Then came AWS (cloud computing), which now generates $90+ billion annually. Then Kindle. Then Alexa. Then Prime.

**Today**

Amazon is worth over $2 trillion. Bezos's personal net worth exceeds $200 billion, making him one of the wealthiest people in history.

His parents' $245,000 investment? Worth over $30 billion.`,
    quote: "I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying.",
    lessons: [
      "Use the 'regret minimization framework' for big decisions",
      "Think long-term when everyone else thinks quarterly",
      "Your parents' belief in you is priceless",
      "Customer obsession beats competitor obsession"
    ],
    tags: ["Tech", "Amazon", "Long-Term Thinking"]
  },
  {
    title: "From a Sugar Shack to $6 Billion: The Fenty Empire of Rihanna",
    subtitle: "How a Barbadian pop star became the richest female musician alive",
    image: "💄",
    intro: "Robyn Rihanna Fenty grew up in a small house in Barbados with an abusive, crack-addicted father. She sold clothes on a street stall with her dad before being discovered at 16.",
    story: `Rihanna grew up in Bridgetown, Barbados. Her father was addicted to crack cocaine. Her parents fought constantly. She suffered from debilitating headaches that doctors initially feared were tumors — they were caused by stress.

**The Discovery**

At 15, she formed a group with two classmates. Music producer Evan Rogers was vacationing in Barbados and agreed to an audition. Rihanna sang Destiny's Child's "Emotion" — and Rogers immediately knew she was special.

**The Music**

By 16, she was in New York. By 17, she had a record deal with Jay-Z's Def Jam. "Pon de Replay" launched her career. Over the next decade, she became one of the best-selling artists of all time — 250 million records sold.

**The Business Pivot**

But Rihanna's real wealth didn't come from music. In 2017, she launched Fenty Beauty with LVMH. Her key insight: the beauty industry ignored women of color. Fenty launched with 40 foundation shades.

It made $100 million in its first 40 days.

**The Empire**

Fenty Beauty is now valued at roughly $2.8 billion. Combined with Savage X Fenty lingerie (valued at $1 billion), Rihanna's total net worth exceeds $1.4 billion.

She went from selling clothes on a Barbadian street stall to becoming the wealthiest female musician on the planet.`,
    quote: "There's something so special about a woman who dominates in a man's world.",
    lessons: [
      "Spot the gap the industry is ignoring",
      "Your fame is a platform — use it to build",
      "Inclusivity isn't just moral — it's profitable",
      "Diversify beyond your original talent"
    ],
    tags: ["Music", "Beauty", "Inclusivity"]
  },
  {
    title: "The Oracle of Omaha: Warren Buffett's 60-Year Compounding Machine",
    subtitle: "How a kid who delivered newspapers built a $130B fortune",
    image: "📊",
    intro: "Warren Buffett bought his first stock at age 11 and filed his first tax return at age 13. He said he started too late.",
    story: `Warren Buffett delivered newspapers at dawn, sold used golf balls, and ran a pinball machine business — all before finishing high school. By age 15, he had $2,000 saved (about $25,000 in today's dollars).

**The Education**

Buffett was rejected from Harvard Business School. Instead, he went to Columbia, where he studied under Benjamin Graham — the father of value investing. This mentorship shaped his entire philosophy.

**The Partnership**

In 1956, at age 25, Buffett started an investment partnership with $100. He compounded money at 30% annually for 13 years straight.

**Berkshire Hathaway**

He bought a failing textile company called Berkshire Hathaway in 1965. Instead of fixing the textile business, he used its cash flow to buy other businesses — insurance, candy, furniture, and eventually massive stakes in Coca-Cola, Apple, and American Express.

**The Compounding**

Here's the mind-blowing part: 99% of Buffett's $130+ billion fortune was earned after his 50th birthday. And 97% was earned after age 65.

Compounding isn't about getting rich quick. It's about getting rich inevitably.

**The Giving Pledge**

Buffett has pledged to give away 99% of his wealth. He's already donated over $50 billion to the Gates Foundation and his children's charities.`,
    quote: "Someone is sitting in the shade today because someone planted a tree a long time ago.",
    lessons: [
      "Start investing as early as humanly possible",
      "Compounding is the most powerful force in finance",
      "Be greedy when others are fearful",
      "Wealth without generosity is just hoarding"
    ],
    tags: ["Investing", "Berkshire", "Compounding"]
  },
  {
    title: "From Night Shifts to Netflix: Reed Hastings' $150B Disruption",
    subtitle: "A $40 late fee destroyed Blockbuster and built a streaming empire",
    image: "🎬",
    intro: "Reed Hastings forgot to return a VHS copy of Apollo 13 to Blockbuster. The $40 late fee made him so angry he built Netflix.",
    story: `The legend goes that Reed Hastings was hit with a $40 late fee at Blockbuster Video. Embarrassed to tell his wife, he started thinking: what if there were no late fees?

**The DVD-by-Mail Idea**

In 1997, Hastings and Marc Randolph started Netflix as a DVD-by-mail service. You picked movies online, they arrived in your mailbox, and you sent them back when you were done. No late fees. Ever.

**Blockbuster Says No**

In 2000, Netflix was struggling. Hastings flew to Dallas and offered to sell Netflix to Blockbuster for $50 million. Blockbuster's CEO laughed them out of the room.

**The Pivot**

Netflix shifted to a subscription model — unlimited DVDs for a flat monthly fee. Customers loved it. Then in 2007, they launched streaming.

**The Destruction**

Blockbuster filed for bankruptcy in 2010. At its peak, it had 9,000 stores and 84,000 employees. Today, one store remains in Bend, Oregon.

**Today**

Netflix has 270+ million subscribers in 190 countries. Revenue exceeds $35 billion annually. Market cap: over $150 billion.

A $40 late fee created a company that changed how the entire world consumes entertainment.`,
    quote: "Most entrepreneurial ideas will sound crazy, stupid, and uneconomic, and then they'll turn out to be right.",
    lessons: [
      "Your frustration is someone else's business opportunity",
      "When your competitor laughs at you, you're onto something",
      "Subscription models create long-term value",
      "Be willing to cannibalize your own business before someone else does"
    ],
    tags: ["Tech", "Disruption", "Streaming"]
  },
  {
    title: "The Orphan Who Built Samsung: Lee Byung-chul's Dynasty",
    subtitle: "From a small rice mill to a $500B tech conglomerate",
    image: "📱",
    intro: "Lee Byung-chul started Samsung in 1938 as a small trading company selling dried fish and noodles. Today it's one of the most valuable companies on Earth.",
    story: `Born in 1910 in a small Korean village, Lee Byung-chul came from a landowning family, but the Japanese occupation stripped them of everything.

**The Beginning**

In 1938, with about $27 in capital, Lee started Samsung — meaning "three stars" — as a trading company in Daegu, South Korea. He sold dried fish, vegetables, and noodles to Manchuria and Beijing.

**Pivoting Through War**

The Korean War destroyed his businesses twice. Each time, Lee rebuilt. He moved into sugar refining, textiles, and insurance.

**The Electronics Gamble**

In 1969, Lee made the boldest move: he entered the electronics industry. Everyone thought he was crazy — Korea had no tech infrastructure.

He started with cheap black-and-white TVs. Then semiconductors. Then memory chips. Each step was dismissed by competitors.

**The Legacy**

Samsung is now the world's largest producer of smartphones, memory chips, and displays. The company generates over $200 billion in annual revenue.

Lee's philosophy was simple: invest in quality until you're number one. It took decades, but Samsung went from dried fish to the world's most valuable tech brands.`,
    quote: "A business should contribute to the development of the country and the well-being of its people.",
    lessons: [
      "Start with whatever you have — even dried fish",
      "War and disaster test your resolve, not your destiny",
      "Enter new industries with long-term patience",
      "Quality eventually beats price"
    ],
    tags: ["Tech", "Conglomerate", "South Korea"]
  },
  {
    title: "From Soviet Poverty to American Billions: Sergey Brin's Google",
    subtitle: "A refugee who fled Russia built the world's most-used product",
    image: "🔍",
    intro: "Sergey Brin was born in Moscow during the Soviet era. His family fled anti-Semitic persecution when he was 6. He co-founded Google at 25.",
    story: `Sergey Brin was born in 1973 in Moscow. His father, a mathematician, faced constant anti-Semitic barriers in the Soviet academic system. The family emigrated to the United States in 1979 when Sergey was six.

**The Meeting**

At Stanford's PhD program, Brin met Larry Page. They argued about everything at first. But they shared a fascination: organizing the world's information.

**The Dorm Room**

In 1998, they launched Google from a garage (rented from Susan Wojcicki, who later became YouTube's CEO). Their innovation: PageRank, an algorithm that ranked web pages by how many other pages linked to them.

**The Growth**

Google processed 10,000 searches per day in 1998. Today it processes 8.5 billion searches per day. The company's parent, Alphabet, is worth over $2 trillion.

**The Impact**

Brin's personal net worth exceeds $120 billion. The refugee kid who arrived in America with nothing helped create the most-used product in human history.

He often credits his immigrant experience: "I know the value of freedom because I once lived without it."`,
    quote: "Obviously everyone wants to be successful, but I want to be looked back on as being very innovative, very trusted and ethical.",
    lessons: [
      "Immigration fuels innovation",
      "Argue with your co-founder — friction creates breakthroughs",
      "Organize complexity better than anyone else",
      "Freedom is the ultimate competitive advantage"
    ],
    tags: ["Tech", "Google", "Immigrant Story"]
  },
  {
    title: "The High School Dropout Who Built WhatsApp: Jan Koum's $22B Exit",
    subtitle: "From collecting food stamps to the biggest acquisition in tech history",
    image: "💬",
    intro: "Jan Koum grew up in a village near Kyiv, Ukraine with no hot water. He swept floors at a grocery store. Then he built WhatsApp and sold it for $22 billion.",
    story: `Jan Koum immigrated to Mountain View, California at age 16 with his mother and grandmother. They relied on food stamps. His mother cleaned houses. Jan swept the floors at a grocery store.

**Self-Taught**

Koum taught himself computer networking from used manuals he bought at thrift stores. He got a job at Yahoo as an infrastructure engineer.

**The Idea**

In 2009, Koum bought an iPhone and realized the App Store was going to change everything. He had a simple idea: let people send messages over the internet instead of expensive SMS.

His guiding principle: no ads, no games, no gimmicks. Just messaging.

**WhatsApp Grows**

WhatsApp grew entirely through word of mouth. No marketing budget. No growth hacking. Just a great product.

By 2014, it had 450 million users.

**The $22 Billion Deal**

Facebook acquired WhatsApp for $22 billion — the largest acquisition of a venture-backed company in history. Koum signed the deal at the door of the social services office where he once collected food stamps.

Today, WhatsApp has over 2 billion users. The kid who swept grocery store floors built the most-used messaging app on the planet.`,
    quote: "I want to do one thing and do it well.",
    lessons: [
      "Simplicity wins — do one thing exceptionally well",
      "No ads, no gimmicks — respect your users",
      "Word of mouth is the best marketing",
      "Your immigrant struggle is your unfair advantage"
    ],
    tags: ["Tech", "WhatsApp", "Immigrant Story"]
  },
  {
    title: "Fired at 30, Billionaire at 40: The Travis Kalanick Uber Story",
    subtitle: "Two failed startups and a snowstorm led to a $75B company",
    image: "🚗",
    intro: "Travis Kalanick's first two companies both failed. His first went bankrupt. He was stuck in the rain in Paris, couldn't get a cab, and the idea for Uber was born.",
    story: `Travis Kalanick dropped out of UCLA to start Scour, a peer-to-peer file sharing service. It was sued for $250 billion by the entertainment industry and went bankrupt.

**Failure Number Two**

His second company, Red Swoosh, limped along for six years. Kalanick slept on friends' couches, maxed out credit cards, and nearly gave up multiple times. He eventually sold it for $19 million — barely enough to pay back investors.

**The Paris Moment**

In 2008, at a tech conference in Paris, Kalanick and Garrett Camp couldn't get a taxi. Standing in the cold, Camp said: "What if you could request a ride from your phone?"

**UberCab**

In 2009, they launched UberCab in San Francisco. It was just black car service — expensive and exclusive.

But the real revolution came with UberX in 2012: anyone with a car could become a driver. This was the ride-sharing model that changed everything.

**The Rocket Ship**

Uber grew faster than almost any company in history. It launched in 785 cities across 91 countries. At its peak valuation, Uber was worth $120 billion.

Today, Uber generates over $37 billion in annual revenue and has completed over 40 billion trips worldwide.`,
    quote: "Fear is the disease. Hustle is the antidote.",
    lessons: [
      "Failed startups are expensive education",
      "Your billion-dollar idea might come from a bad taxi experience",
      "Regulatory battles mean you're disrupting something real",
      "Speed of execution beats perfection"
    ],
    tags: ["Tech", "Uber", "Disruption"]
  },
  {
    title: "The Shy Introvert Who Built IKEA: Ingvar Kamprad's $60B Legacy",
    subtitle: "How a dyslexic farm boy from Sweden furnished the entire world",
    image: "🪑",
    intro: "Ingvar Kamprad started selling matches to neighbors at age 5. By the time he died, IKEA had furnished homes in 63 countries.",
    story: `Ingvar Kamprad grew up on a small farm in Småland, the poorest region of Sweden. He was dyslexic and struggled in school. But he had an eye for business from an impossibly young age.

**The Child Entrepreneur**

At 5, he bought matches in bulk from Stockholm and sold them individually to neighbors. By 10, he was selling Christmas decorations, fish, and pencils on his bicycle.

**IKEA Is Born**

At 17, his father gave him money as a reward for good grades. Kamprad used it to register IKEA in 1943 (the name combines his initials with the farm and village where he grew up).

He started with pens, wallets, and picture frames. Then he had his breakthrough: flat-pack furniture that customers assemble themselves.

**The Revolution**

By shipping furniture in flat boxes, IKEA cut costs by 80%. What once was luxury became affordable for everyone. The showroom experience — walking through fully decorated rooms — made people dream bigger about their homes.

**The Legacy**

At its peak, IKEA generated over $50 billion in annual revenue across 460+ stores in 63 countries. Kamprad was worth an estimated $60 billion but was famously frugal — he drove an old Volvo, flew economy, and ate at IKEA cafeterias.`,
    quote: "The most dangerous poison is the feeling of achievement. The antidote is to every evening think what can be done better tomorrow.",
    lessons: [
      "Make luxury affordable and you'll change the world",
      "Stay frugal no matter how wealthy you become",
      "Simplify the complex — that's where innovation lives",
      "Start selling something, anything, as early as possible"
    ],
    tags: ["Retail", "IKEA", "Frugality"]
  },
  {
    title: "From Debt to Dior: The Bernard Arnault Luxury Dynasty",
    subtitle: "How a French engineer became the richest person on Earth",
    image: "👜",
    intro: "Bernard Arnault wasn't born poor, but he wasn't born into luxury either. He was an engineer who saw an opportunity in a bankrupt textile company — and turned it into LVMH, the world's largest luxury empire.",
    story: `Bernard Arnault trained as an engineer at École Polytechnique. He joined his father's construction company and was comfortable, but not extraordinary.

**The Pivotal Moment**

In 1984, the French government was privatizing a bankrupt textile group called Boussac. Hidden inside was a gem: Christian Dior. Arnault saw what others missed.

He bought the group, sold off everything except Dior, and began his real mission: building the ultimate luxury conglomerate.

**Building LVMH**

Through a series of brilliant (and sometimes ruthless) acquisitions, Arnault assembled Louis Vuitton, Moët Hennessy, Givenchy, Fendi, Bulgari, Tiffany & Co., and 75+ luxury brands under one roof.

His insight: luxury brands are like art — they appreciate in value. While tech companies rise and fall, people will always crave the finest things.

**The Richest Person on Earth**

In 2023, Arnault became the richest person on the planet with a net worth exceeding $220 billion. LVMH generates over $90 billion in annual revenue.

An engineer who bought a bankrupt textile company now controls the dreams of the world's wealthiest consumers.`,
    quote: "In the luxury business, you have to build on heritage.",
    lessons: [
      "Find diamonds hidden in distressed assets",
      "Luxury never goes out of style — it's recession-resistant",
      "Build a portfolio of timeless brands",
      "Think in decades, not quarters"
    ],
    tags: ["Luxury", "LVMH", "Investing"]
  },
  {
    title: "From Apartheid to Billions: Elon Musk's Relentless Ascent",
    subtitle: "Bullied, beaten, and broke — then he built Tesla, SpaceX, and more",
    image: "⚡",
    intro: "Elon Musk was bullied so badly in South Africa that he was once hospitalized. He left home at 17 with almost nothing. He's now one of the wealthiest humans in history.",
    story: `Elon Musk grew up in Pretoria, South Africa during apartheid. He was a bookish kid who was relentlessly bullied. A gang of boys once beat him unconscious and threw him down stairs. He was hospitalized.

**The Escape**

At 17, Musk left South Africa for Canada, then transferred to UPenn. After two days at Stanford's PhD program, he dropped out to start Zip2 — an online city guide.

**The First Wins**

Zip2 sold for $307 million. Musk made $22 million. He invested almost all of it into X.com, which became PayPal. When PayPal sold to eBay for $1.5 billion, Musk made $180 million.

**All In**

Then he did something insane: he split his fortune three ways. $100 million into SpaceX (rockets). $70 million into Tesla (electric cars). $10 million into SolarCity (solar energy).

All three nearly went bankrupt simultaneously in 2008. Musk was borrowing money for rent.

**The Comeback**

SpaceX's fourth rocket launch succeeded just before the company would have died. Tesla secured emergency funding on Christmas Eve 2008. Both survived.

**Today**

SpaceX is valued at $350+ billion. Tesla's market cap has exceeded $1 trillion. Musk's net worth has surpassed $200 billion. The bullied kid from Pretoria is reshaping transportation, energy, and space travel.`,
    quote: "When something is important enough, you do it even if the odds are not in your favor.",
    lessons: [
      "Invest in what you believe, even when it terrifies you",
      "Near-death experiences make companies stronger",
      "Think in terms of physics, not analogies",
      "Your pain can become rocket fuel"
    ],
    tags: ["Tech", "SpaceX", "Tesla"]
  },
  {
    title: "The Single Mom Who Created Harry Potter: J.K. Rowling's $1B Imagination",
    subtitle: "From suicidal depression on welfare to the world's best-selling author",
    image: "⚡",
    intro: "J.K. Rowling was a broke single mother on welfare, clinically depressed, and considering suicide. Then she wrote a story about a boy wizard.",
    story: `In 1993, Joanne Rowling was at rock bottom. Her marriage had failed. She was a single mother living on welfare in Edinburgh. She was clinically depressed and contemplated suicide.

**Writing in Cafés**

She wrote Harry Potter longhand in cafés while her baby daughter slept beside her. She couldn't afford to heat her apartment, so the warm café was her office.

**The Rejections**

When she finished "Harry Potter and the Philosopher's Stone," she submitted it to 12 publishers. All 12 rejected it.

Bloomsbury finally accepted it — reportedly because the CEO's 8-year-old daughter read the first chapter and demanded the rest.

Rowling received an advance of £1,500 and was told she should get a day job because children's books don't make money.

**The Phenomenon**

Harry Potter became the best-selling book series in history — over 500 million copies sold across 80 languages. The films grossed $7.7 billion. The Wizarding World theme parks generate billions more.

**Today**

Rowling's net worth exceeds $1 billion. She's donated so much to charity that she temporarily fell off Forbes' billionaire list — the only person to ever do that through giving.`,
    quote: "Rock bottom became the solid foundation on which I rebuilt my life.",
    lessons: [
      "Your lowest point can be your launching pad",
      "12 rejections means nothing if the 13th says yes",
      "Create the world you wish existed",
      "Give back more than you keep"
    ],
    tags: ["Author", "Harry Potter", "Comeback"]
  },
  {
    title: "The College Dropout Who Built Facebook: Mark Zuckerberg's Social Revolution",
    subtitle: "From a Harvard dorm room to connecting 3 billion people",
    image: "👤",
    intro: "Mark Zuckerberg was 19 when he launched 'TheFacebook' from his Harvard dorm. Twenty years later, Meta is worth over $1 trillion.",
    story: `Mark Zuckerberg started programming as a kid. By high school, companies were offering to buy his software. He turned them down and went to Harvard.

**The Dorm Room**

In February 2004, Zuckerberg launched "TheFacebook" — initially limited to Harvard students. It spread to other Ivy League schools, then to all colleges, then to everyone.

**Moving to Palo Alto**

After sophomore year, Zuckerberg dropped out of Harvard and moved to Palo Alto. He turned down a $1 billion acquisition offer from Yahoo in 2006. People thought he was insane.

**The Growth Machine**

Facebook hit 1 million users. Then 100 million. Then 1 billion. The platform changed how humans communicate, share news, organize events, and even run political campaigns.

**The Acquisitions**

Instagram for $1 billion (now worth $100B+). WhatsApp for $22 billion. Oculus for $2 billion. Zuckerberg didn't just build Facebook — he bought the future of communication.

**Today**

Meta Platforms (rebranded in 2021) generates over $130 billion in annual revenue. Zuckerberg's personal net worth exceeds $180 billion.

The kid who built a website for his college friends now connects 3 billion people daily.`,
    quote: "The biggest risk is not taking any risk.",
    lessons: [
      "Build something people actually use every day",
      "Say no to billion-dollar offers if you believe in the long game",
      "Acquire your future competitors early",
      "Move fast and iterate"
    ],
    tags: ["Tech", "Facebook", "Social Media"]
  },
  {
    title: "From Broke Comedian to Media Mogul: Tyler Perry's $1B Empire",
    subtitle: "Homeless, abused, and laughed at — then he built his own movie studio",
    image: "🎭",
    intro: "Tyler Perry was homeless, sleeping in his car, and couldn't sell tickets to his plays. Now he owns one of the largest production studios in the world.",
    story: `Tyler Perry grew up in poverty in New Orleans. His father beat him viciously. He was molested by multiple adults. He attempted suicide as a teenager.

**The Plays**

Inspired by Oprah, Perry started writing plays. His first production, "I Know I've Been Changed," opened in 1992 to an audience of 30 people in a 1,200-seat theater.

He lost everything. He was evicted. He lived in his car.

But he kept revising and re-staging the play. For six years, he failed.

**The Breakthrough**

In 1998, the play finally caught on. By 2000, Perry was selling out 10,000-seat arenas for his stage plays — something unheard of in theater.

**Madea and Movies**

Perry created the character Madea — a tough, hilarious grandmother. His Madea films have grossed over $1 billion. He's written, directed, and produced over 30 films and 20 TV shows.

**Tyler Perry Studios**

In 2019, Perry opened Tyler Perry Studios in Atlanta — a 330-acre lot (larger than any major Hollywood studio) that includes 40 buildings and 12 soundstages. He owns it outright with no partners.

**Today**

Perry's net worth exceeds $1 billion. He's the only person to own an entire major studio without corporate backing. The man who performed for 30 people now employs thousands.`,
    quote: "It doesn't matter if a million people tell you what you can't do, or if ten million tell you no. If you get one yes from God, that's all you need.",
    lessons: [
      "Six years of failure is just a very long setup",
      "Know your audience and serve them relentlessly",
      "Ownership beats fame every single time",
      "Your pain becomes your art becomes your fortune"
    ],
    tags: ["Entertainment", "Self-Made", "Studio"]
  },
  {
    title: "The Nurse Who Built Bumble: Whitney Wolfe Herd's $8B Dating Revolution",
    subtitle: "Harassed and fired from Tinder, she built a bigger company",
    image: "🐝",
    intro: "Whitney Wolfe Herd co-founded Tinder, was pushed out amid allegations of harassment, then built Bumble — where women make the first move.",
    story: `Whitney Wolfe Herd was a co-founder of Tinder. After a painful breakup with another co-founder and allegations of sexual harassment, she left the company.

**The Lawsuit**

She filed a lawsuit against Tinder alleging sexual harassment and discrimination. The case was settled, but the experience left her shattered.

**The Idea**

What if there was a dating app where women were in control? Where they made the first move? Where the power dynamic was flipped?

In 2014, she launched Bumble.

**Women First**

The concept was revolutionary: on Bumble, only women can initiate conversations with men. This simple flip reduced harassment, changed dating dynamics, and attracted millions of women who felt unsafe on other platforms.

**The IPO**

In February 2021, at age 31, Wolfe Herd took Bumble public. On its first day, the company was valued at $8.2 billion. She became the youngest female CEO to take a company public.

**Today**

Bumble has over 50 million users worldwide. Wolfe Herd's personal net worth exceeded $1.5 billion at its peak.

She turned her worst experience into a company that changed how millions of people find love.`,
    quote: "The future of dating is setting boundaries and making empowered choices.",
    lessons: [
      "Turn your worst experience into your best idea",
      "Flipping one assumption can create a billion-dollar company",
      "Empowering your users is the best growth strategy",
      "Don't let a setback define your story"
    ],
    tags: ["Tech", "Dating", "Women in Business"]
  },
  {
    title: "From a Peanut Farm to $100 Billion: The Walmart Story",
    subtitle: "Sam Walton's obsession with saving people money built the world's largest company",
    image: "🏪",
    intro: "Sam Walton opened a five-and-dime store in small-town Arkansas. His competitors laughed. He ended up building the world's largest company by revenue.",
    story: `Sam Walton grew up during the Depression. His family moved constantly. He worked odd jobs and delivered newspapers to help make ends meet.

**The First Store**

In 1945, Walton bought a Ben Franklin franchise in Newport, Arkansas. He was obsessed with one thing: selling for less than competitors.

His landlord refused to renew his lease (his own competitor bought the building). Walton lost everything and had to start over in Bentonville.

**Walmart Opens**

In 1962, at age 44, Walton opened the first Walmart in Rogers, Arkansas. His strategy was radical: open in small towns that big retailers ignored, and offer the lowest prices possible.

Competitors laughed. Small towns? Discount stores? It'll never work.

**The Strategy**

Walton flew his own plane to scout store locations. He visited competitors obsessively. He used technology before anyone else — satellite systems, supply chain optimization, just-in-time inventory.

**The Empire**

By 1985, Forbes named Walton the richest person in America. Today, Walmart generates $650+ billion in annual revenue. It employs 2.1 million people — the largest private employer on Earth.

The Walton family's combined wealth exceeds $250 billion.`,
    quote: "There is only one boss — the customer. And he can fire everybody in the company, from the chairman on down.",
    lessons: [
      "Go where the competition won't",
      "Save your customer money and they'll be loyal for life",
      "Losing a store taught him to never depend on one landlord again",
      "Visit competitors religiously"
    ],
    tags: ["Retail", "Walmart", "Small Town"]
  },
  {
    title: "The Pizza Boy Who Built Domino's: Tom Monaghan's $1.5B Slice",
    subtitle: "An orphan and foster kid who turned a single pizza shop into 19,000 stores",
    image: "🍕",
    intro: "Tom Monaghan spent years in foster homes and an orphanage. He bought a failing pizza shop with $500 borrowed dollars. It became Domino's Pizza.",
    story: `Tom Monaghan's father died when he was 4. His mother couldn't support him and his brother, so she placed them in foster homes and later an orphanage where they spent years.

**The $500 Bet**

In 1960, Monaghan and his brother bought a small pizza place called DomiNick's in Ypsilanti, Michigan for $500. His brother traded his half of the business for a VW Beetle a few months later.

**30 Minutes or Free**

Monaghan's breakthrough: guaranteed delivery in 30 minutes or less, or the pizza was free. This promise was radical in the 1960s. It required obsessive systems — layout, prep, routing, everything optimized.

**Near-Death**

The company nearly went bankrupt multiple times. In 1970, a fire destroyed his commissary. In the mid-'80s, he was $1.5 billion in debt.

Each time, Monaghan rebuilt.

**The Empire**

Today, Domino's has over 19,000 stores in 90+ countries. Annual revenue exceeds $4.5 billion. Monaghan sold the company in 1998 for about $1 billion.

The orphan who no one wanted built a company that feeds millions of people every single day.`,
    quote: "I believe in a hands-on approach. You can't run a business from behind a desk.",
    lessons: [
      "A simple promise (30 min delivery) can define a brand",
      "Systems beat talent at scale",
      "Bankruptcy is a comma, not a period",
      "Your childhood pain doesn't determine your adult ceiling"
    ],
    tags: ["Food", "Franchise", "Perseverance"]
  },
  {
    title: "From a Dorm Room to $50 Billion: Michael Dell's PC Revolution",
    subtitle: "A 19-year-old sold computers from his college dorm and disrupted IBM",
    image: "💻",
    intro: "Michael Dell was pre-med at the University of Texas. He started selling custom-built PCs from his dorm room with $1,000. He never went back to class.",
    story: `Michael Dell saw something that IBM, HP, and Compaq missed: people wanted to customize their computers, and selling direct was cheaper than going through retail stores.

**The Dorm Room**

In 1984, at age 19, Dell started PC's Limited from his University of Texas dorm room with $1,000 in capital. He bought excess inventory from retailers, upgraded the computers, and sold them direct.

**Direct to Consumer**

Dell's breakthrough: cut out the middleman. Build to order. Ship direct. This model eliminated billions in inventory costs.

By the end of his first year, Dell had $73,000 in revenue. He dropped out of college.

**The Rocket**

Dell Computer Corporation went public in 1988. Through the '90s and 2000s, Dell became the world's largest PC maker. Revenue exceeded $60 billion.

**The Buyback**

In 2013, Dell took his company private for $25 billion — the largest management buyout in tech history. He used the privacy to restructure.

In 2018, Dell Technologies went public again through a reverse merger with VMware, valued at over $50 billion.

**Today**

Dell Technologies generates over $100 billion in annual revenue. Michael Dell's personal net worth exceeds $60 billion. The dorm-room computer builder became one of the most successful entrepreneurs in tech history.`,
    quote: "Don't spend so much time trying to choose the perfect opportunity that you miss the right opportunity.",
    lessons: [
      "Direct-to-consumer eliminates waste and increases margins",
      "Start with $1,000 and hustle — you don't need venture capital",
      "Going private can give you room to reinvent",
      "Build what customers actually want, not what you think they want"
    ],
    tags: ["Tech", "Direct Sales", "College Dropout"]
  },
  {
    title: "The Barber Who Built a Billion-Dollar Brand: Daymond John's FUBU Story",
    subtitle: "How a waiter from Queens turned $40 into a $6B fashion empire",
    image: "🧢",
    intro: "Daymond John worked as a waiter at Red Lobster while sewing hats in his mother's house in Queens. He turned $40 worth of fabric into FUBU — a $6 billion fashion brand.",
    story: `Daymond John grew up in Hollis, Queens — the same neighborhood as Run-DMC and LL Cool J. He wasn't connected to the music industry, but he understood street culture.

**$40 Worth of Fabric**

In 1992, Daymond saw an opportunity in hip-hop fashion. He bought $40 of fabric and sewed hats, selling them on street corners for $10 each.

His mother mortgaged her house to give him $100,000. He converted the house into a factory.

**FUBU: For Us, By Us**

The name said it all — FUBU was built by and for the hip-hop community. When LL Cool J wore FUBU in a Gap commercial (sneaking it in), sales exploded.

**The Grind**

Daymond kept working at Red Lobster throughout FUBU's early years. He worked 7 PM to 3 AM at the restaurant, then sewed and shipped until 10 AM.

**The Empire**

At its peak, FUBU generated over $350 million in annual revenue and $6 billion in lifetime sales worldwide. Daymond became a household name as an investor on ABC's Shark Tank.

**Today**

Daymond's net worth exceeds $350 million. He's invested in over 100 companies through Shark Tank. The kid from Queens who sewed hats now mentors the next generation of entrepreneurs.`,
    quote: "The only difference between a stumbling block and a stepping stone is how high you raise your foot.",
    lessons: [
      "Start with what you can afford — even $40",
      "Your culture is your competitive advantage",
      "Keep your day job until you absolutely don't need it",
      "A mother who believes in you is worth more than venture capital"
    ],
    tags: ["Fashion", "FUBU", "Shark Tank"]
  },
  {
    title: "The Fired Animator Who Built DreamWorks: Jeffrey Katzenberg's Revenge",
    subtitle: "Passed over for a promotion, he co-founded a studio that challenged Disney",
    image: "🎞️",
    intro: "Jeffrey Katzenberg was the golden boy at Disney who oversaw The Little Mermaid, Beauty and the Beast, Aladdin, and The Lion King. Then they passed him over for president — so he built DreamWorks.",
    story: `Jeffrey Katzenberg spent ten years at Walt Disney Studios as chairman. Under his leadership, Disney Animation had a renaissance — four massive hits in a row.

**The Snub**

When Disney president Frank Wells died in a helicopter crash, Katzenberg expected the promotion. Disney CEO Michael Eisner chose someone else. Katzenberg was devastated and furious.

**DreamWorks Is Born**

In 1994, Katzenberg partnered with Steven Spielberg and David Geffen to launch DreamWorks SKG. Three entertainment legends, $33 million each, and a mission to challenge every major studio.

**Shrek Changes Everything**

In 2001, Shrek was released — a direct parody of Disney fairy tales. It made $484 million and won the first-ever Academy Award for Best Animated Feature.

The Shrek franchise went on to earn $3.5 billion globally.

**The Exit**

DreamWorks Animation was eventually sold to NBCUniversal for $3.8 billion in 2016. Katzenberg's cut was estimated at over $400 million.

Being fired from Disney was the best thing that ever happened to him.`,
    quote: "If you don't make the movie, the movie doesn't get made.",
    lessons: [
      "Being passed over can be the spark for your greatest work",
      "Partner with people who complement your weaknesses",
      "Competition breeds creativity",
      "The best revenge is massive success"
    ],
    tags: ["Entertainment", "DreamWorks", "Comeback"]
  },
  {
    title: "From Food Stamps to Fortune 500: Shahid Khan's $12B Journey",
    subtitle: "A Pakistani immigrant who washed dishes for $1.20/hour now owns the Jacksonville Jaguars",
    image: "🏈",
    intro: "Shahid Khan arrived in America from Pakistan at 16 with $500. He washed dishes in a college dorm for $1.20 an hour. Today he's worth $12 billion.",
    story: `In 1967, Shahid Khan left Lahore, Pakistan for Champaign, Illinois. His first night in America was spent at a $2-a-night YMCA room. His first job was washing dishes in the University of Illinois dorm cafeteria.

**The Education**

Khan studied engineering at the University of Illinois. He worked for Flex-N-Gate, an auto parts manufacturer, while still in school.

**The Buyout**

In 1980, Khan borrowed money to buy Flex-N-Gate. He started with $16 million in revenue and one big idea: one-piece truck bumpers.

His bumper design was simpler, cheaper, and better. Toyota became his first major client.

**The Growth**

Flex-N-Gate grew from $16 million to $9 billion in annual revenue. The company now employs over 25,000 people and supplies bumpers and components to every major automaker.

**The Trophies**

Khan bought the Jacksonville Jaguars NFL team in 2012 for $770 million. He bought Fulham F.C. in England. He owns the Four Seasons Hotel in Toronto.

**Today**

Khan's net worth exceeds $12 billion. He's the wealthiest person of Pakistani origin in the world. The dishwasher from the dorm cafeteria now owns NFL and Premier League teams.`,
    quote: "There are people who have great ideas but don't execute. For me, execution is everything.",
    lessons: [
      "The boring industries (auto parts) can make you the richest",
      "One superior product design can define your career",
      "Execution matters infinitely more than ideas",
      "America's promise is real for those willing to work"
    ],
    tags: ["Manufacturing", "NFL Owner", "Immigrant Story"]
  },
  {
    title: "From Dishwasher to Casino King: Sheldon Adelson's $35B Bet",
    subtitle: "A kid from the Boston slums who reinvented Las Vegas and Macau",
    image: "🎰",
    intro: "Sheldon Adelson grew up in a tenement in Boston. He started 50 businesses before finding his fortune. He didn't become a billionaire until age 60.",
    story: `Sheldon Adelson grew up in the Dorchester neighborhood of Boston, sharing a one-room apartment with his parents. His father was a cab driver. His mother ran a knitting shop.

**The Serial Entrepreneur**

Adelson started selling newspapers at age 12. Over the next four decades, he started roughly 50 businesses. Most failed. He sold toiletry kits, worked as a mortgage broker, ran a charter tour business, and sold spray-on de-icer for windshields.

**COMDEX**

In 1979, Adelson co-founded COMDEX — the computer trade show. It became the largest tech trade show in the world. He sold it in 1995 for $862 million.

**The Venetian**

With the COMDEX profits, Adelson bought the Sands Hotel in Las Vegas and demolished it. In its place, he built The Venetian — a massive luxury resort that combined casino, hotel, and convention space.

**Macau: The Mega-Bet**

His biggest bet: Macau. In 2004, he opened the Sands Macau, then the Venetian Macao — the world's largest casino. Macau's gambling revenue surpassed Las Vegas, and Adelson was at the center of it.

**The Peak**

At his peak, Adelson was worth $35 billion. Las Vegas Sands generated over $13 billion in annual revenue.

The kid from the Boston tenement who failed 50 times became one of the richest people on the planet — after age 60.`,
    quote: "I never had any doubts about my abilities. I was always a very good negotiator.",
    lessons: [
      "50 failures before finding your fortune is normal",
      "Being a late bloomer doesn't limit your ceiling",
      "Think bigger than your market — go global",
      "Convention businesses and casinos? Combine them"
    ],
    tags: ["Casino", "Late Bloomer", "Vegas"]
  },
  {
    title: "The Teenager Who Built Stripe: Patrick Collison's $95B Payments Empire",
    subtitle: "Two brothers from rural Ireland built the backbone of internet commerce",
    image: "💳",
    intro: "Patrick and John Collison grew up in rural Tipperary, Ireland. Patrick won a national science competition at 16. By 21, he'd co-founded Stripe, now worth $95 billion.",
    story: `Patrick Collison started programming at age 10 on a borrowed laptop. At 16, he won Ireland's Young Scientist of the Year competition. He got into MIT. His brother John got into Harvard.

**The Problem**

In 2010, the brothers noticed that accepting payments online was absurdly complicated. Setting up a merchant account took weeks of paperwork, bank negotiations, and technical integration.

**Seven Lines of Code**

Stripe's pitch was elegant: add seven lines of code to your website, and you can accept payments. That's it. No forms. No banks. No weeks of waiting.

**The Growth**

Y Combinator funded them. Peter Thiel invested. Within years, Stripe was processing billions in payments for companies like Amazon, Google, Shopify, and Lyft.

**Today**

Stripe processes hundreds of billions of dollars in payments annually. The company is valued at $95 billion, making it one of the most valuable private companies in the world.

Patrick and John Collison — two brothers from a village of 200 people in rural Ireland — built the infrastructure that powers internet commerce globally.`,
    quote: "We're building economic infrastructure for the internet.",
    lessons: [
      "Simplify something complicated and you'll build an empire",
      "Two founders who are siblings can be unstoppable",
      "Infrastructure businesses are the most valuable",
      "You don't need to be in Silicon Valley to change the world"
    ],
    tags: ["Tech", "Fintech", "Ireland"]
  },
  {
    title: "From Poverty in Trinidad to Beauty Billions: Rihanna's Fenty Rival — Pat McGrath",
    subtitle: "A self-taught makeup artist built a $1B cosmetics brand",
    image: "✨",
    intro: "Pat McGrath learned makeup from her mother in Northampton, England using whatever they could afford. She became the most influential makeup artist alive, then built a billion-dollar brand.",
    story: `Pat McGrath's mother Jean was obsessed with fashion and beauty. They couldn't afford designer makeup, so Jean taught Pat to mix their own using pigments from art stores.

**The Art**

McGrath never went to beauty school. She learned by experimenting — on herself, on her mother, on anyone who'd sit still. She moved to London and broke into fashion.

**The Rise**

McGrath became the go-to makeup artist for every major designer: Prada, Versace, Dolce & Gabbana, Dior. She did over 80 Vogue covers. She transformed backstage at fashion shows into art studios.

Vogue called her "the most influential makeup artist in the world."

**The Brand**

In 2015, McGrath launched Pat McGrath Labs with a $25 gold pigment kit. It sold out in minutes. She hadn't spent a single dollar on traditional advertising — her reputation was the marketing.

**Today**

Pat McGrath Labs was valued at $1 billion in 2019. McGrath built the brand with no formal education, no investors for years, and no compromises on quality.

The girl who mixed art-store pigments in Northampton now runs one of the most prestigious beauty brands on Earth.`,
    quote: "Makeup is there to enjoy. It's not a chore. It's not a necessity. It's a joy.",
    lessons: [
      "Master your craft for decades before monetizing",
      "Your reputation can be your only marketing",
      "Limitations breed creativity — use what you have",
      "Build a brand on artistry, not trends"
    ],
    tags: ["Beauty", "Fashion", "Self-Taught"]
  },
  {
    title: "The Refugee Who Built eBay: Pierre Omidyar's Auction Revolution",
    subtitle: "A broken laser pointer sold for $14.83 — and proved people would buy anything online",
    image: "🔨",
    intro: "Pierre Omidyar built eBay over a Labor Day weekend in 1995. His first item sold was a broken laser pointer. The buyer said he collected broken laser pointers.",
    story: `Pierre Omidyar was born in Paris to Iranian immigrant parents. They moved to the US when he was young. He studied computer science at Tufts.

**The Experiment**

Over Labor Day weekend 1995, Omidyar built AuctionWeb — a simple website where people could list items for auction. He hosted it on his personal web page.

The first item sold was his own broken laser pointer. It sold for $14.83. Omidyar emailed the buyer: "You know it's broken, right?" The buyer replied: "I'm a collector of broken laser pointers."

That moment proved something profound: the internet could create markets for anything.

**The Growth**

AuctionWeb became eBay. By 1997, it was hosting 800,000 auctions per day. The IPO in September 1998 made Omidyar a billionaire overnight at age 31.

**The Impact**

eBay created an entirely new economy. Regular people could become entrepreneurs from their living rooms. It democratized commerce years before Shopify or Amazon Marketplace.

**Today**

eBay has facilitated over $300 billion in merchandise sales. Omidyar's net worth exceeds $8 billion. He's given over $1 billion to philanthropic causes.

A broken laser pointer launched a revolution.`,
    quote: "What makes eBay successful — the real value and the real power at eBay — is the community.",
    lessons: [
      "Build something over a weekend and see what happens",
      "There's a buyer for literally everything",
      "Community-driven platforms create lasting value",
      "Give regular people the tools to become entrepreneurs"
    ],
    tags: ["Tech", "E-commerce", "Community"]
  },
  {
    title: "From Cleaning Toilets to Cosmetics Queen: Estée Lauder's Beauty Dynasty",
    subtitle: "A daughter of immigrants who built a $90B beauty empire by never taking no",
    image: "💋",
    intro: "Estée Lauder started by selling face cream her uncle made in the family kitchen. She personally gave makeovers to anyone who'd sit in her chair. She built one of the most valuable beauty companies in history.",
    story: `Born Josephine Esther Mentzer in Queens, New York, Estée was the daughter of Hungarian immigrants. Her uncle, a chemist, made skin creams in a makeshift lab behind their house.

**The Start**

Young Estée became obsessed with skin care. She started selling her uncle's creams anywhere she could — beauty salons, beach clubs, hotel lobbies. She gave free makeovers to every woman she met.

**The Secret Weapon**

Estée invented the "gift with purchase" — the free sample that every cosmetics company now uses. She gave away so many free samples that her husband thought she'd bankrupt them.

But it worked. Women who tried the products came back to buy them.

**Breaking Into Saks**

After being rejected repeatedly, Lauder arranged to give a makeover demonstration at a charity event attended by Saks Fifth Avenue executives. The products sold out. Saks placed an order.

**The Empire**

Estée Lauder Companies now owns Clinique, MAC, Bobbi Brown, La Mer, Tom Ford Beauty, and dozens more brands. Annual revenue exceeds $15 billion. The company is valued at over $90 billion.

The Lauder family's fortune exceeds $40 billion.`,
    quote: "I never dreamed about success. I worked for it.",
    lessons: [
      "Free samples and generosity create loyal customers",
      "Personal selling beats advertising early on",
      "Build a portfolio of brands, not just one product",
      "Never accept a closed door as permanent"
    ],
    tags: ["Beauty", "Sales", "Dynasty"]
  },
  {
    title: "The Monk Who Became a Billionaire: Zhang Yiming's TikTok Empire",
    subtitle: "A quiet software engineer from China built the most addictive app in the world",
    image: "🎵",
    intro: "Zhang Yiming was an introverted programmer who studied microelectronics. He built ByteDance — the company behind TikTok — and became one of the wealthiest people in China.",
    story: `Zhang Yiming was born in 1983 in Longyan, a small city in Fujian province, China. He studied software engineering at Nankai University and was known for being quiet and analytical.

**The Insight**

After graduating, Yiming worked at several startups. He became obsessed with one idea: algorithms that learn what you want before you know it yourself.

**ByteDance**

In 2012, he founded ByteDance. Its first product, Toutiao, was a news aggregation app that used AI to personalize content feeds. No human editors. Just algorithms. It exploded.

**TikTok**

In 2016, ByteDance launched Douyin in China (known internationally as TikTok). Short-form video + an addictive recommendation algorithm = the fastest-growing app in history.

TikTok reached 1 billion users faster than any app ever.

**The Scale**

ByteDance became the most valuable private company in the world, valued at over $400 billion. TikTok generates over $20 billion in annual advertising revenue.

**Today**

Yiming stepped down as CEO in 2021, preferring to work on long-term projects. His net worth exceeds $50 billion. The quiet programmer who studied microelectronics created the app that defines an entire generation's culture.`,
    quote: "Always stay calm and rational. It's very important to remain humble.",
    lessons: [
      "The best products learn from their users",
      "Algorithms can be more powerful than human editors",
      "Short-form content captures attention better than anything",
      "Introverts can build extroverted empires"
    ],
    tags: ["Tech", "TikTok", "AI"]
  },
  {
    title: "From Poverty in Japan to PlayStation: Ken Kutaragi's $45B Vision",
    subtitle: "The engineer who was told video games were beneath Sony — then proved everyone wrong",
    image: "🎮",
    intro: "Ken Kutaragi was a junior engineer at Sony who secretly worked on a gaming chip against his bosses' wishes. His rebellious side project became PlayStation.",
    story: `Ken Kutaragi grew up in a working-class neighborhood in Tokyo. He was a tinkerer who loved taking electronics apart and rebuilding them.

**The Secret Project**

While working at Sony, Kutaragi saw his daughter playing a Nintendo Famicom. He thought: Sony could build something better. But Sony's leadership saw video games as toys — beneath a prestigious electronics company.

Kutaragi secretly collaborated with Nintendo on the Super Famicom's sound chip. When Sony's management found out, they were furious.

**The Champion**

Sony CEO Norio Ohga overruled the objectors and greenlit Kutaragi's vision: a dedicated gaming console with CD-ROM technology.

**PlayStation Launches**

The original PlayStation launched in 1994 in Japan. It sold 100 million units. PlayStation 2, launched in 2000, sold 155 million units — the best-selling console of all time.

**The Legacy**

The PlayStation brand has generated over $45 billion in revenue. It transformed gaming from a children's hobby into mainstream adult entertainment.

Kutaragi, once dismissed by his own company, is now known as "The Father of PlayStation." The rebellious engineer who was told his idea was beneath Sony created one of the company's most profitable divisions.`,
    quote: "Don't be afraid. Make a new standard. Push it out to the world.",
    lessons: [
      "Sometimes the best ideas start as rebellious side projects",
      "One champion in leadership can change everything",
      "Industries seen as 'beneath you' might be worth billions",
      "Never let corporate hierarchy kill innovation"
    ],
    tags: ["Gaming", "Sony", "Innovation"]
  },
  {
    title: "The Farm Girl Who Built The Body Shop: Anita Roddick's Ethical Empire",
    subtitle: "How a teacher with no business training created a $1B global brand based on values",
    image: "🌿",
    intro: "Anita Roddick opened a tiny shop in Brighton, England selling naturally-inspired cosmetics in refillable bottles. She had no business plan. She just wanted to do good.",
    story: `Anita Roddick was a teacher and human rights activist. She had zero business training. In 1976, she needed to support her family while her husband traveled South America.

**The Tiny Shop**

She opened The Body Shop in Brighton with £4,000. The name was pragmatic — it was next to a funeral parlor, so she thought it was funny. The local funeral directors didn't agree and tried to shut her down.

She sold 15 products in small bottles (to keep costs down) and encouraged customers to bring bottles back for refills (to save money). This accidentally made her an environmental pioneer.

**Values-Driven Business**

Roddick was against animal testing decades before it became mainstream. She sourced ingredients through fair trade before the term existed. She used her shop windows for human rights campaigns.

**The Growth**

By 2004, The Body Shop had 1,980 stores in 50 countries. In 2006, L'Oréal acquired the company for £652 million ($1 billion).

**The Legacy**

Roddick proved that business could be a force for good — and that consumers would pay for it. She donated most of her fortune to charity before her death in 2007.`,
    quote: "If you think you're too small to have an impact, try going to bed with a mosquito.",
    lessons: [
      "Values-driven businesses attract loyal customers",
      "Limitations (small bottles) can become brand features",
      "You don't need a business degree to build a global brand",
      "Profit and purpose can coexist beautifully"
    ],
    tags: ["Ethical Business", "Beauty", "Activism"]
  },
  {
    title: "From a Borrowed $15K to $100 Billion: The Nike Story",
    subtitle: "Phil Knight sold shoes from the trunk of his car at track meets",
    image: "👟",
    intro: "Phil Knight was a middle-distance runner at the University of Oregon. He wrote a business school paper about importing Japanese running shoes. That paper became Nike.",
    story: `Phil Knight's Stanford MBA thesis argued that Japanese running shoes could dominate the American market just as Japanese cameras had disrupted German cameras.

**The Trip**

In 1962, after graduating, Knight flew to Japan. He struck a deal with Onitsuka Tiger to distribute their shoes in America.

**Blue Ribbon Sports**

Knight and his former track coach Bill Bowerman each put in $500 to start Blue Ribbon Sports. Knight sold shoes from the trunk of his green Plymouth Valiant at track meets.

**The Waffle Iron**

Bowerman's wife's waffle iron became the prototype for Nike's revolutionary waffle sole. He literally poured rubber into the waffle iron to create a new kind of running shoe grip.

**The Swoosh**

In 1971, they renamed the company Nike. The Swoosh logo was designed by a graphic design student, Carolyn Davidson, for $35. (Knight later gave her stock worth over $1 million.)

**Just Do It**

The "Just Do It" campaign launched in 1988. The Michael Jordan partnership produced Air Jordans — the most successful athlete endorsement in history. Jordan's deal generates over $5 billion annually for Nike.

**Today**

Nike generates over $50 billion in annual revenue. Knight's personal net worth exceeds $40 billion. It all started with a thesis paper and a car trunk.`,
    quote: "There is an immutable conflict at work in life and in business, a constant battle between peace and chaos.",
    lessons: [
      "Your thesis paper might contain your billion-dollar idea",
      "Start scrappy — sell from your car if you have to",
      "Innovation can come from a waffle iron",
      "Athlete partnerships create cultural movements, not just sales"
    ],
    tags: ["Sports", "Nike", "Branding"]
  },
  {
    title: "The Accountant Who Built Under Armour: Kevin Plank's $5B Sweat Revolution",
    subtitle: "A walk-on football player was tired of sweaty cotton shirts — so he made something better",
    image: "🏋️",
    intro: "Kevin Plank was a special teams captain on the University of Maryland football team. He was tired of changing sweat-soaked cotton T-shirts. So he built Under Armour.",
    story: `Kevin Plank played football at Maryland — not as a star, but as a walk-on who made the team through sheer grit. He noticed that athletes changed T-shirts multiple times during practice because cotton got heavy with sweat.

**The Basement**

After graduating in 1996, Plank went to fabric stores and bought synthetic materials. He sewed prototype shirts in his grandmother's basement.

He drove up and down the East Coast, selling shirts out of his car to college and NFL equipment managers. His first year revenue: $17,000.

**The Breakthrough**

A pivotal moment: the film "Any Given Sunday" featured Under Armour shirts. Then athletes started wearing them in the NFL. Word of mouth spread through locker rooms.

**Going Public**

Under Armour went public in 2005 at $13 per share. By 2015, the stock had risen over 3,000%. Revenue surpassed $5 billion.

**Today**

Under Armour is worn by millions of athletes worldwide. Plank built a multi-billion-dollar brand by solving a problem every athlete understood: nobody likes a wet, heavy cotton shirt.`,
    quote: "If you build a great product, the brand will follow.",
    lessons: [
      "The best businesses solve problems the founder personally experienced",
      "Start in your grandmother's basement if you have to",
      "Locker room word-of-mouth is the best marketing",
      "Walk-ons can outperform stars"
    ],
    tags: ["Sports", "Entrepreneurship", "Athletic Wear"]
  },
  {
    title: "The Taxi Driver's Son Who Built Zoom: Eric Yuan's $20B Connection",
    subtitle: "Denied a US visa 8 times, he finally got in and built the app the world needed",
    image: "📹",
    intro: "Eric Yuan applied for a US visa eight times and was rejected eight times. On his ninth attempt, he got in. He built Zoom — the app that kept the world connected during a pandemic.",
    story: `Eric Yuan grew up in Tai'an, China. His parents were mining engineers. As a university student, he was inspired by a Bill Gates speech about the internet.

**The Visa Struggle**

Yuan applied for a US visa eight times over two years. Eight times rejected. On his ninth application, at age 27, he was finally approved.

**WebEx and Cisco**

He joined WebEx as one of its first 20 engineers. When Cisco acquired WebEx for $3.2 billion, Yuan became VP of Engineering.

But he was frustrated. Customers kept complaining about video quality. He proposed rebuilding the platform. Cisco said no.

**Building Zoom**

In 2011, Yuan left Cisco and founded Zoom Video Communications. His pitch was simple: video conferencing that actually works. No downloads needed. No complicated setup. It just works.

**The Pandemic**

When COVID-19 hit in 2020, Zoom went from 10 million daily participants to 300 million in three months. The word "Zoom" became a verb.

**Today**

Zoom generates over $4 billion in annual revenue. Yuan's net worth has exceeded $20 billion. The man who was rejected by America eight times built the technology that America couldn't live without.`,
    quote: "If you are happy, your employees are happy. If your employees are happy, your customers are happy.",
    lessons: [
      "Nine attempts at a visa — persistence defines success",
      "If your employer won't fix the problem, become the solution",
      "Make technology that 'just works'",
      "Being ready when the moment comes is everything"
    ],
    tags: ["Tech", "Zoom", "Immigrant Story"]
  },
  {
    title: "The Farmer's Daughter Who Disrupted Finance: Abigail Johnson's $28B Fidelity",
    subtitle: "How she modernized her family's mutual fund company into a fintech giant",
    image: "📈",
    intro: "Abigail Johnson grew up around the dinner table hearing about mutual funds. She took her family's company from old-school investing to cutting-edge fintech.",
    story: `Abigail Johnson is the granddaughter of Fidelity Investments founder Edward Johnson II. She could have coasted on the family name. Instead, she transformed the company.

**Earning It**

Johnson started at Fidelity as an analyst — not as an executive. She worked her way through the ranks, managing portfolios and proving herself as an investor before moving into leadership.

**The Digital Transformation**

When Johnson became CEO in 2014, she pushed Fidelity aggressively into digital investing, mobile apps, and — controversially — cryptocurrency. She was one of the first major finance CEOs to embrace Bitcoin.

She launched Fidelity Digital Assets in 2018, allowing institutional investors to trade and custody cryptocurrency.

**The Scale**

Under her leadership, Fidelity grew from managing $2 trillion to over $12 trillion in assets. The company serves 43 million individual investors.

**Today**

Johnson's personal net worth exceeds $28 billion, making her one of the wealthiest women in the world. She proved that inheriting a company doesn't mean you can't revolutionize it.`,
    quote: "Every one of our customers already has a financial advisor. It's called Google.",
    lessons: [
      "Earn your position even when you could inherit it",
      "Embrace new technology before your competitors",
      "Managing trillions starts with managing one portfolio well",
      "Second-generation leaders can be just as innovative"
    ],
    tags: ["Finance", "Fidelity", "Women in Business"]
  },
  {
    title: "From a Mud Hut to Millions: Lupita Nyong'o's Oscar-Winning Journey",
    subtitle: "Born in Mexico, raised in Kenya, crowned in Hollywood",
    image: "🌟",
    intro: "Lupita Nyong'o was born in Mexico to Kenyan parents, grew up in Nairobi, and had to choose between a safe career and her dream of acting. She chose the dream.",
    story: `Lupita Nyong'o was born in Mexico City, where her father was a visiting political science professor. Her family returned to Kenya when she was young.

**The Choice**

Nyong'o studied film and theater at Hampshire College, then returned to Nairobi to work in film production. She could have had a comfortable career behind the camera. But she wanted to act.

At 25, she applied to the Yale School of Drama — one of the most competitive acting programs in the world. She got in.

**12 Years a Slave**

While still at Yale, Nyong'o auditioned for Steve McQueen's "12 Years a Slave." She landed the role of Patsey — her first feature film role ever.

Her performance was devastating. She won the Academy Award for Best Supporting Actress at 31 — becoming only the sixth African actress to win an Oscar.

**The Platform**

Nyong'o used her platform to advocate for representation in Hollywood, becoming a Lancôme ambassador (the first Black woman to do so), starring in blockbusters like Black Panther, and writing a children's book about colorism.

**The Impact**

From a family of political refugees to the highest stages in entertainment, Nyong'o's journey isn't just about wealth — it's about proving that extraordinary talent exists everywhere, if Hollywood would just look.`,
    quote: "No matter where you're from, your dreams are valid.",
    lessons: [
      "Choose the dream over the safe path",
      "Education and training sharpen raw talent",
      "Your first role can change everything",
      "Use your platform for more than just yourself"
    ],
    tags: ["Entertainment", "Representation", "Oscar"]
  },
  {
    title: "The Broke Student Who Built Canva: Melanie Perkins' $40B Design Revolution",
    subtitle: "A 19-year-old from Perth, Australia took on Adobe — and won",
    image: "🎨",
    intro: "Melanie Perkins was teaching design software to students and realized it was absurdly hard to use. So she decided to make design accessible to everyone.",
    story: `At 19, while studying at the University of Western Australia, Melanie Perkins was teaching other students how to use complex design software. She was frustrated: why did design tools have to be so complicated?

**The First Attempt**

In 2007, she and her boyfriend Cliff Obrecht launched Fusion Books — an online tool for designing school yearbooks. It worked, but Perkins had a bigger vision.

**100 Investor Rejections**

Perkins pitched her idea for an online design platform to over 100 investors. Most said no. A 19-year-old from Perth, Australia with no tech pedigree? Silicon Valley wasn't interested.

She persisted for three years, flying between Perth and San Francisco countless times.

**Canva Launches**

In 2013, after finally securing funding, Canva launched. The pitch: professional design made drag-and-drop simple. No design degree required.

**The Explosion**

Canva now has over 170 million monthly active users across 190 countries. The platform is used by 85% of Fortune 500 companies.

**Today**

Canva is valued at over $40 billion. Perkins and Obrecht have pledged to give away the majority of their wealth — currently valued at over $8 billion combined.

The girl from Perth who couldn't get a meeting built the design tool the world was waiting for.`,
    quote: "We want to empower the whole world to design.",
    lessons: [
      "If the tool is too hard to use, build a better one",
      "100 rejections mean nothing if the 101st says yes",
      "Democratizing a skill creates massive markets",
      "Your 'disadvantage' (being from Perth, not SF) doesn't matter"
    ],
    tags: ["Tech", "Design", "Australia"]
  },
  {
    title: "From Harlem to Billions: Robert F. Smith's Quiet Tech Fortune",
    subtitle: "The richest Black American built his fortune where nobody was looking — enterprise software",
    image: "🖥️",
    intro: "Robert F. Smith grew up in a working-class family in Denver. His mother and father were both school principals. He became the wealthiest Black person in America through private equity — not entertainment.",
    story: `Robert F. Smith wanted to intern at Bell Labs as a teenager. He called every week for months. They told him they didn't take high school interns. He kept calling until they created a position for him.

**The Education**

Smith studied chemical engineering at Cornell, then got his MBA from Columbia. He worked at Goldman Sachs in tech mergers and acquisitions, learning how to value technology companies.

**Vista Equity Partners**

In 2000, Smith founded Vista Equity Partners, a private equity firm focused exclusively on enterprise software companies. This was deeply unsexy — no consumer brands, no flashy logos. Just B2B software.

But Smith realized something: software companies have recurring revenue, high margins, and sticky customers. They're the best businesses in the world.

**The Track Record**

Vista Equity has generated returns exceeding 20% annually for over two decades. The firm manages over $100 billion in assets.

**The Gift**

In 2019, during a commencement speech at Morehouse College, Smith announced he would pay off the student debt of the entire graduating class — roughly $34 million.

**Today**

Smith's personal net worth exceeds $9 billion. He built his fortune quietly, in an industry most people never think about, proving that the biggest opportunities are often in the most boring places.`,
    quote: "We all have a responsibility to reach back and pull others forward.",
    lessons: [
      "The most boring industries often have the best economics",
      "Persistence — calling Bell Labs weekly — opens doors",
      "Recurring revenue is the best kind of revenue",
      "Use your wealth to change lives directly"
    ],
    tags: ["Finance", "Private Equity", "Philanthropy"]
  },
  {
    title: "The Night Owl Who Built Airbnb: Brian Chesky's $80B Hotel Killer",
    subtitle: "Three broke designers rented air mattresses and built a company bigger than Hilton",
    image: "🏠",
    intro: "Brian Chesky couldn't afford rent in San Francisco. So he put air mattresses on his living room floor and rented them to strangers. That idea became Airbnb.",
    story: `In 2007, Brian Chesky and Joe Gebbia were broke designers in San Francisco. A design conference was coming to town, and all the hotels were sold out.

**The Air Mattresses**

They bought three air mattresses, set up a simple website called "Air Bed and Breakfast," and offered conference attendees a place to sleep for $80 a night — breakfast included.

Three strangers slept on their floor. Airbnb was born.

**The Cereal Boxes**

During the 2008 election, Airbnb was still struggling. To fund the company, they created custom cereal boxes — "Obama O's" and "Cap'n McCains" — and sold them for $40 each. They made $30,000.

**Y Combinator**

Paul Graham at Y Combinator initially rejected them. Then, impressed by the cereal box hustle, he invested. "If you can convince people to pay $40 for a $4 box of cereal, you can figure this out."

**The Scale**

Airbnb now lists over 7 million properties in 220+ countries. It has hosted over 1.5 billion guest arrivals. The company went public in 2020 at a valuation of over $100 billion.

**Today**

Chesky's net worth exceeds $10 billion. Three air mattresses on a living room floor became a company worth more than Hilton, Marriott, and Hyatt combined.`,
    quote: "If we tried to think of a good idea, we wouldn't have been able to think of a good idea.",
    lessons: [
      "Your desperation can birth your biggest idea",
      "Hustle creatively — even cereal boxes count",
      "The sharing economy was hiding in plain sight",
      "Don't be afraid to let strangers sleep on your floor"
    ],
    tags: ["Tech", "Sharing Economy", "Airbnb"]
  },
  {
    title: "From War-Torn Lebanon to Fashion's Throne: Elie Saab's Couture Dream",
    subtitle: "A teenager sewing in his mother's living room during a civil war became fashion royalty",
    image: "👑",
    intro: "Elie Saab started sewing at age 9. By 18, he'd opened his own atelier in Beirut — during the Lebanese Civil War. His gowns are now worn by royalty and Oscar winners.",
    story: `Born in 1964 in Beirut, Lebanon, Elie Saab was the son of a woodworker. At 9 years old, he began cutting fabric and sewing clothes for his sisters and neighbors.

**During the War**

The Lebanese Civil War began in 1975 and lasted 15 years. While bombs fell on Beirut, 18-year-old Saab opened his first atelier with a small team of seamstresses.

He refused to leave. He believed beauty could exist even in war.

**The International Stage**

Saab became the first non-Italian designer invited to present at Rome's Alta Moda (Haute Couture). His elaborate, embroidered gowns caught the world's attention.

**The Oscar Moment**

In 2002, Halle Berry won the Best Actress Oscar wearing a burgundy Elie Saab gown. It became one of the most iconic Oscar dresses in history. Orders flooded in from around the world.

**Today**

Elie Saab dresses royalty, heads of state, and Hollywood's biggest stars. His brand operates in 160 countries. Queen Rania of Jordan, Beyoncé, and Angelina Jolie all wear his designs.

A boy who sewed in a living room during a civil war built one of the most respected fashion houses in the world.`,
    quote: "My aesthetic is that of a dream. I want women to feel like they're walking in a dream.",
    lessons: [
      "Art thrives even in the worst circumstances",
      "One iconic moment (the Oscar dress) can define your brand",
      "Start with your hands, not with capital",
      "Never wait for perfect conditions to begin"
    ],
    tags: ["Fashion", "Haute Couture", "Resilience"]
  },
  {
    title: "From a Shack in South Africa to SpaceX: Gwynne Shotwell's Rocket Rise",
    subtitle: "The woman who makes SpaceX actually work",
    image: "🚀",
    intro: "Gwynne Shotwell was inspired to become an engineer after attending a talk by a female mechanical engineer as a teenager. She's now the President of SpaceX, running the company's day-to-day operations.",
    story: `Gwynne Shotwell grew up in Libertyville, Illinois. Her mother was an artist, her father a brain surgeon. She wanted to be a car designer — until she heard a female engineer speak at a Society of Women Engineers event.

**The Career**

Shotwell studied mechanical engineering at Northwestern and got her master's at Georgia Tech. She worked in aerospace — at Chrysler's space division and The Aerospace Corporation — before joining SpaceX in 2002 as employee #7.

**The Impossible Sell**

SpaceX's early years were defined by failure. Three rocket launches failed in a row. They were nearly bankrupt. But Shotwell was responsible for closing the deals that kept the company alive.

Her superpower: she could explain incredibly complex rocket science to customers in plain English — and make them believe.

**The Turnaround**

Shotwell closed SpaceX's first NASA contract: a $1.6 billion deal for cargo flights to the International Space Station. It saved the company.

**Today**

As President and COO, Shotwell runs SpaceX's $350+ billion business. She oversees Falcon 9 (the most successful rocket in history), Starship (the most powerful rocket ever built), and Starlink (a satellite internet constellation with 6,000+ satellites).

The teenager who was inspired by one female engineer now leads the most ambitious space company on Earth.`,
    quote: "I don't believe in luck. I believe in hard work and surrounding yourself with the right people.",
    lessons: [
      "One inspiring talk can change a teenager's entire trajectory",
      "The ability to explain complexity simply is a superpower",
      "Being employee #7 at the right company beats being CEO of the wrong one",
      "Operators are just as important as visionaries"
    ],
    tags: ["Space", "SpaceX", "Women in STEM"]
  },
  {
    title: "The Janitor's Son Who Built Chick-fil-A: Truett Cathy's $17B Legacy",
    subtitle: "A boarding house kid invented the chicken sandwich and built a restaurant empire — closed on Sundays",
    image: "🐔",
    intro: "Truett Cathy grew up in poverty during the Depression, helped his mother run a boarding house, and opened a tiny restaurant. His invention of the boneless chicken sandwich created a $17 billion empire.",
    story: `S. Truett Cathy was born in 1921 in Eatonton, Georgia. His family was poor — his mother ran a boarding house to make ends meet. Young Truett helped cook, clean, and serve guests.

**The Dwarf House**

After serving in World War II, Cathy and his brother opened a small restaurant called the Dwarf Grill (later Dwarf House) near Atlanta's airport in 1946.

**The Invention**

In the early 1960s, Cathy did something revolutionary: he put a boneless, seasoned chicken breast between two buttered buns with pickles. The original chicken sandwich.

**Chick-fil-A**

In 1967, Cathy opened the first Chick-fil-A in Atlanta's Greenbriar Mall. His model was different from other fast food chains: smaller menus, higher quality, and — controversially — closed every Sunday.

**Closed on Sundays**

Business advisors told him he was leaving 15% of revenue on the table. Cathy didn't care. "I believe God honors our decision," he said. The policy remains to this day.

**Today**

Chick-fil-A generates over $17 billion in annual revenue — more per restaurant than McDonald's, Starbucks, or Subway, despite being open one less day. The Cathy family's fortune exceeds $14 billion.

The boarding house kid built America's most efficient restaurant chain by doing less, not more.`,
    quote: "Nearly every moment of every day we have the opportunity to give something to someone else — our time, our love, our resources.",
    lessons: [
      "Doing less (closed Sundays) can mean earning more",
      "A simple product done perfectly beats a complex menu",
      "Values-driven businesses attract devoted customers",
      "Hospitality isn't a department — it's a culture"
    ],
    tags: ["Food", "Values", "Franchise"]
  },
  {
    title: "From Nigerian Immigrant to Tech Titan: Tope Awotona's Calendly Success",
    subtitle: "A serial entrepreneur who failed three times then built a $3B scheduling tool",
    image: "📅",
    intro: "Tope Awotona emigrated from Nigeria as a teenager. After three failed startups, he emptied his life savings to build Calendly — now used by millions worldwide.",
    story: `Tope Awotona grew up in Lagos, Nigeria. When he was 12, he witnessed his father get killed in a carjacking. His family moved to the United States seeking safety and opportunity.

**The Failed Startups**

Awotona started three different businesses — a dating service, a projector company, and a gardening products business. All three failed.

Each failure ate into his savings. Most people would have stopped.

**The Pain Point**

Working in sales, Awotona was constantly frustrated by the back-and-forth emails required to schedule meetings. He thought: what if scheduling could be done with a single link?

**All In**

In 2013, he invested his entire life savings — $200,000 — into building Calendly. He hired a development team in Ukraine and personally managed every aspect of the product.

**The Growth**

Calendly spread virally — every time someone shared their scheduling link, the recipient discovered the product. No ads needed.

By 2021, Calendly had 10 million monthly users and was valued at $3 billion.

**Today**

Calendly is used by millions of professionals, sales teams, and businesses worldwide. Awotona went from immigrant with failed businesses to a billionaire who built one of the most useful business tools on the internet.`,
    quote: "The best ideas come from your own frustrations. Build what you wish existed.",
    lessons: [
      "Three failures don't disqualify you from success",
      "Products that spread through usage don't need marketing budgets",
      "Solve your own pain point and you'll solve millions of others'",
      "Putting your life savings in means you'll fight harder"
    ],
    tags: ["Tech", "SaaS", "Immigrant Story"]
  },
  {
    title: "The Dropout Who Built Oracle: Larry Ellison's $140B Database Empire",
    subtitle: "A college dropout who couldn't hold a job built the company that runs the world's data",
    image: "🗄️",
    intro: "Larry Ellison dropped out of two colleges, couldn't hold a steady job, and was told by his adoptive father that he would never amount to anything. He built Oracle — worth over $300 billion.",
    story: `Larry Ellison was born in New York City to an unwed mother and raised by his great-uncle in Chicago. His adoptive father was cold and critical, constantly telling young Larry he'd never succeed.

**The Drifter**

Ellison dropped out of the University of Illinois after his adoptive mother died. He dropped out of the University of Chicago after one semester. He moved to California with $1,200 in his pocket.

For years, he bounced between jobs — programmer, odd jobs, whatever paid. He was married and divorced twice before age 30.

**The CIA Inspiration**

While working at Ampex, Ellison worked on a database project for the CIA codenamed "Oracle." He read a paper by IBM researcher Edgar Codd about relational databases and realized: IBM was sitting on a revolutionary idea and not building it.

**Software Development Laboratories**

In 1977, Ellison co-founded Software Development Laboratories with Bob Miner and Ed Oates. Their first product: a relational database. Their first customer: the CIA.

The company was renamed Oracle.

**The Empire**

Oracle became the dominant enterprise database company. Then Ellison expanded into cloud computing, enterprise applications, and healthcare IT through a series of aggressive acquisitions.

**Today**

Oracle generates over $50 billion in annual revenue. Ellison's personal net worth exceeds $140 billion. The college dropout his father said would amount to nothing is one of the five richest people on Earth.`,
    quote: "I have had all of the disadvantages required for success.",
    lessons: [
      "Your father's opinion of you doesn't define your ceiling",
      "Build what giants are too slow to build themselves",
      "Being a 'drifter' teaches you adaptability",
      "Aggressive acquisition can be a valid growth strategy"
    ],
    tags: ["Tech", "Oracle", "Perseverance"]
  },
  {
    title: "From Mexican Telecom to Richest on Earth: Carlos Slim's $90B Empire",
    subtitle: "How a shopkeeper's son mastered the art of buying low during crises",
    image: "📞",
    intro: "Carlos Slim's father was a Lebanese immigrant who ran a small shop in Mexico City. Slim learned business at his father's side, bought companies during every economic crisis, and became the richest person in the world.",
    story: `Carlos Slim Helú was born in 1940 in Mexico City. His father, Julián Slim Haddad, emigrated from Lebanon at age 14 and built a small but successful business empire.

**The Ledger**

Slim's father taught him to keep detailed financial ledgers starting at age 10. By 12, Carlos had bought his first shares of stock. By 17, he was making $200 a week from investments.

**The Crisis Investor**

Slim's genius was buying when everyone else was selling. During Mexico's 1982 economic crisis, he bought companies at fire-sale prices. When the peso crashed in 1994, he bought more.

**Telmex**

His transformative deal: in 1990, Slim bought Telmex (Mexico's state telephone company) during its privatization for $1.7 billion. He modernized the phone system and expanded service across Latin America.

Telmex made Slim fabulously wealthy as Mexico's telecommunications industry exploded.

**The Richest Person**

From 2010 to 2013, Carlos Slim was the richest person in the world, with a peak net worth exceeding $90 billion. His company, América Móvil, serves over 280 million mobile subscribers.

**Today**

Slim remains one of the top 15 wealthiest people alive. The shopkeeper's son who kept ledgers at 10 built one of the largest fortunes in history by having the courage to invest when others panicked.`,
    quote: "When there is a crisis, that's when some are interested in getting out and that's when we are interested in getting in.",
    lessons: [
      "Buy when there's blood in the streets",
      "Teach your children about money early",
      "Infrastructure businesses create generational wealth",
      "Crisis is opportunity wearing a mask"
    ],
    tags: ["Telecom", "Investing", "Mexico"]
  },
];

// Weekly story selection (rotates every 7 days, resets each year)
export function getWeeklyStory(): WealthStory {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekIndex = Math.floor(dayOfYear / 7) % WEALTH_STORIES.length;
  return WEALTH_STORIES[weekIndex];
}

// Get story ID from title (for tracking)
export function getStoryId(story: WealthStory): string {
  return story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
}
