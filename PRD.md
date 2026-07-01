








LexLoo
APP PRODUCT REQUIREMENTS DOCUMENT & BUILD BIBLE
The complete app specification for building the wearable learning platform MVP and scalable future architecture.




Learn. Wear. Master.




Version 2.0  |  App Build Focus  |  Confidential

Table of Contents
1. Product North Star — Vision, mission, user promise, app-first build strategy.
2. MVP Scope — What must be built now versus what is intentionally deferred.
3. User Personas and Jobs — Students, parents, teachers, adult learners, admins.
4. Complete App Experience — Every major user flow from onboarding to mastery.
5. Screen-by-Screen Build Specs — Detailed screen dictionary for engineers and AI coding agents.
6. Learning Content System — Words, tiles, packs, difficulty, translations, pronunciation, media.
7. QR and Tile Architecture — How physical tiles connect to digital learning.
8. Gamification and Habit Engine — XP, streaks, badges, missions, levels, rewards.
9. Parent Dashboard — Family account model and child progress visibility.
10. Admin Dashboard — Internal operations, content management, tile assignment, analytics.
11. Backend and Database — Schema, services, rules, storage, API design.
12. AI Features — Future-proof AI tutor, AI explanations, quiz generation, memory engine.
13. UX/UI Design System — Colors, typography, components, states, accessibility.
14. Analytics, Notifications, and Launch — Events, KPIs, reminders, beta, rollout plan.
15. Master Build Prompt — Copy/paste prompt for Cursor, Codex, Claude Code, Windsurf, Lovable, or Replit Agent.
This document is intentionally app-build focused. Manufacturing details are referenced only when required to connect the physical LexLoo bracelet and tile system to the app experience.

1. Product North Star
LexLoo is the wearable learning platform that starts on the wrist and continues inside the app.
Source alignment: LexLoo is defined as a wearable learning platform where students wear words, scan words, learn words, use words, master words, build streaks, earn rewards, unlock achievements, and develop a learning identity. The physical concept includes a silicone bracelet, interchangeable word tiles, QR/scan experience, word packs, Looz charms, and packaging that teaches users to choose, wear, scan, and learn.
LexLoo should not be built like a normal flashcard app. The product promise is physical-digital learning: a student chooses a word tile, wears it, sees it throughout the day, scans it, learns it, practices it, and eventually masters it. The app exists to make the physical product meaningful and to turn simple word exposure into measurable learning progress.
The app must help the user build a learning identity. Every interaction should answer one of four questions: what word am I learning, why does it matter, how do I practice it now, and how do I know I am improving?
• Primary promise: make vocabulary visible, wearable, repeatable, and rewarding.
• MVP promise: users can scan a tile and learn from it within seconds.
• Long-term promise: a full learning platform for words, languages, school vocabulary, SAT, career paths, and lifelong learning.

2. App Build Objective
The immediate job is to build the app, not the entire future company at once.
The build should begin with an MVP that proves the daily loop: scan a word tile, learn the word, complete a short practice activity, earn XP, and return tomorrow. Anything that does not strengthen this loop should either be excluded or built as a simple placeholder.
The MVP must feel real and premium even if the underlying learning engine is simple. The first version should be reliable, fast, and easy enough for a child to use without explanation.
• Build mobile-first.
• Use real accounts and persistent data.
• Support QR scanning.
• Support word packs and tile codes.
• Support XP, streaks, badges, and saved words.
• Support an admin panel to create words, packs, and tile codes.

3. Non-Negotiable Product Principles
These are the rules every developer and AI agent must follow.
LexLoo must stay simple at the surface and powerful under the hood. A child should be able to scan and learn without understanding the database, spaced repetition, or gamification model. Parents and schools should see progress, not complexity.
The app cannot become a random dictionary. It must stay connected to the bracelet, the tile, the word pack, and the user’s learning journey.
• Every scan should create a learning event.
• Every word page should include one clear primary action.
• Every new feature must improve daily engagement, mastery, retention, parent confidence, or school usefulness.
• Never hardcode word data in the UI.
• Never design a screen that requires users to read long instructions before learning.

4. MVP Scope Summary
The MVP is Wear & Learn plus enough habit engine to drive retention.
The first build should include onboarding, authentication, QR scanning, word detail pages, audio pronunciation, quiz games, saved words, learning progress, XP, streaks, achievements, parent view, and admin content management. The app should be built so later versions can add AI coach, schools, marketplace, and social features without rewriting the core data model.
Area
Specification
Included Now
Auth, onboarding, scanner, word detail, packs, learning games, progress, XP, streaks, badges, profile, parent dashboard, admin dashboard.
Deferred
Teacher marketplace, national leaderboards, AI conversation partner, physical rewards store, full school district platform, geolocation challenges.
Architecture Requirement
Database must support future V1-V3 roadmap without major migration.

5. MVP Success Criteria
The app is successful when a user learns from a physical tile in less than 30 seconds.
The MVP should be judged by learning loop completion, not feature count. A working build means a new user can create an account, scan or enter a tile code, view the word, hear pronunciation, answer a practice question, earn XP, save the word, and see progress on the home screen.
• Time from app open to scanner: under 5 seconds after onboarding.
• Time from scan to word detail: under 2 seconds on normal connection.
• First learning activity available immediately on word detail.
• Progress updates instantly after quiz completion.
• Daily streak logic cannot be confusing or unfair.

6. Target Users
LexLoo begins with students but must be flexible enough for language learners and adults.
The app should serve multiple audiences without overwhelming the MVP. The default experience should be student-friendly. Parent and admin experiences can be separate sections with simpler interfaces. Teacher and school features should be architected but not fully launched until later.
• Elementary students learning beginner words and languages.
• Middle school students building vocabulary habits.
• High school students preparing for SAT/ACT and academic writing.
• Parents who want visible progress.
• Admins who manage word packs and tile codes.
• Future: teachers, schools, tutors, corporations, and specialty learners.

7. Primary User Journey
Choose, wear, scan, learn, practice, master.
The main journey starts before the app: the user receives a LexLoo bracelet and word tiles. The packaging explains that every tile is a word and every side teaches. The app must continue this same story. When the student scans, the app should feel like unlocking something that was hidden inside the physical tile.
Area
Specification
Step 1
Open the LexLoo app and scan a tile.
Step 2
Word detail opens with definition, pronunciation, translation if relevant, example, and quick practice.
Step 3
User completes a learning game and earns XP.
Step 4
User saves or masters the word.
Step 5
Home screen updates streak, XP, daily mission, and next Wear of the Day.

8. App Platforms
Build for iOS and Android with one shared codebase.
The preferred mobile implementation is React Native with Expo or Flutter. The strongest path for AI coding agents is React Native + Expo + TypeScript because the ecosystem is fast, readable, and integrates well with camera scanning, push notifications, and Supabase/Firebase.
• Recommended frontend: React Native + Expo + TypeScript.
• Recommended backend: Supabase or Firebase.
• Recommended admin: Next.js web dashboard using the same backend.
• Do not build native Swift/Kotlin separately for MVP unless a dedicated mobile team exists.

9. Technical North Star
Simple app now, scalable learning platform later.
The system should be modular from day one. The scanner should not directly decide what screen to open. The scanner resolves a tile code. The backend returns tile metadata. The app routes to the correct learning object. This separation allows future NFC, image recognition, school assignments, and marketplace packs.
Area
Specification
Core Service
Authentication, profiles, children, packs, words, tiles, scans, attempts, mastery, XP, streaks, badges.
Content Service
Word content, translations, examples, difficulty, audio, tags, categories.
Engagement Service
Missions, reminders, streaks, rewards, recommendations.
Admin Service
Content operations, tile mapping, pack publishing, analytics.

10. Brand Experience
Premium, playful, educational, and physical-digital.
The app should match the dark premium packaging and bracelet concept: deep navy/black surfaces, bright blue and orange accents, clean cards, glowing scan states, and clear learning typography. The visual feeling should be more Apple Watch + Duolingo + premium school product than childish toy.
• Primary background: deep navy / near black.
• Primary accent: electric LexLoo blue.
• Secondary accent: LexLoo orange.
• Use bright reward moments sparingly.
• Use large readable word cards.
• Keep the scanner and word detail screens visually iconic.

11. Problems LexLoo Solves
Vocabulary apps are invisible after the phone is closed; LexLoo keeps the word visible all day.
Students forget vocabulary because exposure is short, abstract, and disconnected from real life. LexLoo solves this by turning a vocabulary word into a physical object that the student wears, sees, scans, and practices repeatedly.
• Low retention from one-time studying.
• Lack of daily habit formation.
• Boring vocabulary memorization.
• Parents cannot see progress.
• Teachers struggle to make vocabulary feel real.

12. Why Physical + Digital Matters
The bracelet is the reminder; the app is the learning engine.
A physical word tile creates ambient repetition. The app turns that repetition into structured learning and measurable progress. Together they create a loop stronger than either product alone.
• Physical tile: identity and reminder.
• QR/NFC scan: bridge into digital learning.
• App: explanation, practice, progress, rewards.
• Parent/admin: visibility and control.

13. MVP Product Promise
A child can scan a tile and understand a word without help.
The first product promise should be extremely direct. The user scans a tile. The app explains the word simply. The user practices. The user earns progress. This should happen without menus, confusion, or extra setup.
• No complex onboarding.
• No hidden scan button.
• No paywall before first learning event.
• No empty states that feel broken.

14. App-First Build Strategy
Build the app around real data, not mock screens.
Even the earliest MVP must use real persistent word records, tile records, scan events, and user progress. This prevents throwaway prototypes and makes the product scalable from the beginning.
• Create a small seed database.
• Build admin tools immediately.
• Use feature flags for future features.
• Track events from the first beta.

15. App Release Definition
An MVP release is not done until a user can complete the daily loop three days in a row.
A one-time scan demo is not enough. The release must support repeat use, daily reminders, streak logic, saved words, and progress history.
• Day 1: scan and learn.
• Day 2: reminder and continue streak.
• Day 3: review prior word and learn a new word.
• Admin can add more words without code.

16. Product Boundaries
Do not build the whole ecosystem before proving the loop.
The roadmap includes schools, social, marketplace, AI, certifications, and global competitions. Those ideas matter, but the first app build should not collapse under their weight. The architecture should support them; the MVP UI should not expose them unless usable.
• Build now: Wear & Learn.
• Prepare now: data model for schools and marketplace.
• Do later: social competitions, teacher marketplace, AI conversations, certifications.

17. Founder Decision Log
Decisions that must remain consistent during build.
LexLoo is not a bracelet company. LexLoo is a lifelong learning platform that starts on the wrist. The first app should prove that statement through the scan-learn-master loop.
• The bracelet is the acquisition hook.
• The app is the retention engine.
• Word packs are the content business.
• Schools and parents are the scale channels.

18. Build Roles
How the AI agent or engineering team should behave.
The builder should act as product manager, UX designer, architect, and senior engineer, but should not invent product direction. When ambiguity exists, choose the simplest option that supports the MVP loop and document the assumption.
• Ask only when blocked.
• Do not remove specified features.
• Do not add unrelated features.
• Keep code modular and documented.

19. Definition of Done
Every feature must pass functional, UX, and data checks.
A feature is not complete because a screen exists. It is complete only when the data saves correctly, errors are handled, loading states exist, analytics events fire, and the user can understand what happened.
• Functional acceptance.
• Visual acceptance.
• Accessibility acceptance.
• Analytics acceptance.
• Admin manageability.

20. MVP Data Philosophy
Content is product, not filler.
Every word record should be treated like a learning object. The database must support definition, short definition, pronunciation, audio, translations, examples, synonyms, antonyms, word origin, difficulty, tags, and pack membership.
• One word can appear in many packs.
• One tile can resolve to one word instance.
• One user can have different mastery state per word.
• One parent can monitor multiple children.

Persona 1: Elementary Student
Age 6-10, beginner vocabulary and first language exposure
Wants short, fun, visual interactions. Needs simple words, audio, quick wins, and rewards that feel immediate.
Use large buttons, simple definitions, fun badges, and no long reading blocks.
• Primary job: learn and remember words with less friction.
• Emotional job: feel smarter, more confident, and consistent.
• Product risk: too many features can distract from scan-learn-master.
Area
Specification
Profile Need
Wants short, fun, visual interactions. Needs simple words, audio, quick wins, and rewards that feel immediate.
App Implication
Use large buttons, simple definitions, fun badges, and no long reading blocks.
MVP Must Have
The user must be able to complete a learning session in under two minutes.

Persona 2: Middle School Student
Age 11-14, academic vocabulary and habit building
Wants to feel progress and independence. Needs definitions that are not babyish, quiz variety, streaks, and social proof later.
Use confident language, levels, streaks, and performance history.
• Primary job: learn and remember words with less friction.
• Emotional job: feel smarter, more confident, and consistent.
• Product risk: too many features can distract from scan-learn-master.
Area
Specification
Profile Need
Wants to feel progress and independence. Needs definitions that are not babyish, quiz variety, streaks, and social proof later.
App Implication
Use confident language, levels, streaks, and performance history.
MVP Must Have
The user must be able to complete a learning session in under two minutes.

Persona 3: High School SAT Student
Age 14-18, test prep and advanced vocabulary
Wants efficiency and measurable improvement. Needs difficulty labels, synonyms, antonyms, examples, spaced review, and mastery tracking.
Add SAT/ACT packs, advanced definitions, usage examples, and weak-word review.
• Primary job: learn and remember words with less friction.
• Emotional job: feel smarter, more confident, and consistent.
• Product risk: too many features can distract from scan-learn-master.
Area
Specification
Profile Need
Wants efficiency and measurable improvement. Needs difficulty labels, synonyms, antonyms, examples, spaced review, and mastery tracking.
App Implication
Add SAT/ACT packs, advanced definitions, usage examples, and weak-word review.
MVP Must Have
The user must be able to complete a learning session in under two minutes.

Persona 4: Parent Buyer
Adult purchaser monitoring progress
Wants confidence that the product is educational, safe, and worth the cost. Needs child progress, weekly summaries, mastered words, and streak visibility.
Create simple parent dashboard with positive progress, not overwhelming analytics.
• Primary job: learn and remember words with less friction.
• Emotional job: feel smarter, more confident, and consistent.
• Product risk: too many features can distract from scan-learn-master.
Area
Specification
Profile Need
Wants confidence that the product is educational, safe, and worth the cost. Needs child progress, weekly summaries, mastered words, and streak visibility.
App Implication
Create simple parent dashboard with positive progress, not overwhelming analytics.
MVP Must Have
The user must be able to complete a learning session in under two minutes.

Persona 5: Adult Language Learner
Adult learning Spanish, Hebrew, Mandarin, French, or other packs
Wants practical vocabulary and pronunciation. Needs translation, audio, examples, and daily consistency.
Allow adult onboarding and mature learning packs without childish UI.
• Primary job: learn and remember words with less friction.
• Emotional job: feel smarter, more confident, and consistent.
• Product risk: too many features can distract from scan-learn-master.
Area
Specification
Profile Need
Wants practical vocabulary and pronunciation. Needs translation, audio, examples, and daily consistency.
App Implication
Allow adult onboarding and mature learning packs without childish UI.
MVP Must Have
The user must be able to complete a learning session in under two minutes.

Persona 6: Internal Admin
LexLoo operator managing content and QR/tile records
Wants reliable tools to add words, packs, tile codes, audio, and publish content. Needs validation and audit trails.
Build admin panel early because physical product requires accurate code mapping.
• Primary job: learn and remember words with less friction.
• Emotional job: feel smarter, more confident, and consistent.
• Product risk: too many features can distract from scan-learn-master.
Area
Specification
Profile Need
Wants reliable tools to add words, packs, tile codes, audio, and publish content. Needs validation and audit trails.
App Implication
Build admin panel early because physical product requires accurate code mapping.
MVP Must Have
The user must be able to complete a learning session in under two minutes.

Persona 7: Future Teacher
Teacher assigning vocabulary to classes
Wants control, reporting, and classroom engagement. Needs assignments, progress, class lists, and exportable summaries.
Do not build full teacher platform in MVP, but keep schema ready.
• Primary job: learn and remember words with less friction.
• Emotional job: feel smarter, more confident, and consistent.
• Product risk: too many features can distract from scan-learn-master.
Area
Specification
Profile Need
Wants control, reporting, and classroom engagement. Needs assignments, progress, class lists, and exportable summaries.
App Implication
Do not build full teacher platform in MVP, but keep schema ready.
MVP Must Have
The user must be able to complete a learning session in under two minutes.

Persona 8: Future School Buyer
School or tutoring center licensing LexLoo
Wants outcomes, safety, ease of deployment, reporting, and classroom management. Needs district-level controls later.
Prepare organization model and roles, but defer full enterprise rollout.
• Primary job: learn and remember words with less friction.
• Emotional job: feel smarter, more confident, and consistent.
• Product risk: too many features can distract from scan-learn-master.
Area
Specification
Profile Need
Wants outcomes, safety, ease of deployment, reporting, and classroom management. Needs district-level controls later.
App Implication
Prepare organization model and roles, but defer full enterprise rollout.
MVP Must Have
The user must be able to complete a learning session in under two minutes.

Journey 1: New User First Scan
Install app -> create account -> select goal -> scan tile -> unlock word -> complete first practice -> earn First Scan badge.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
Install app
Happy Path
Install app -> create account -> select goal -> scan tile -> unlock word -> complete first practice -> earn First Scan badge.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Journey 2: Returning Daily Learner
Open app -> see Word/Wear of the Day -> scan worn tile -> review weak word -> complete mission -> extend streak.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
Open app
Happy Path
Open app -> see Word/Wear of the Day -> scan worn tile -> review weak word -> complete mission -> extend streak.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Journey 3: Parent Checking Progress
Open parent view -> select child -> see weekly summary -> review mastered words -> celebrate milestone.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
Open parent view
Happy Path
Open parent view -> select child -> see weekly summary -> review mastered words -> celebrate milestone.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Journey 4: Admin Creating Pack
Login admin -> create pack -> add words -> assign levels/tags -> generate tile codes -> publish pack.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
Login admin
Happy Path
Login admin -> create pack -> add words -> assign levels/tags -> generate tile codes -> publish pack.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Journey 5: User Fails Scan
Open scanner -> camera cannot read -> show tips -> allow manual code entry -> resolve code -> continue flow.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
Open scanner
Happy Path
Open scanner -> camera cannot read -> show tips -> allow manual code entry -> resolve code -> continue flow.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Journey 6: User Reviews Saved Words
Open profile -> saved words -> filter by pack/difficulty -> practice selected word -> update mastery.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
Open profile
Happy Path
Open profile -> saved words -> filter by pack/difficulty -> practice selected word -> update mastery.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Journey 7: User Earns Badge
Complete event -> backend evaluates achievement -> badge modal -> profile updated -> analytics logged.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
Complete event
Happy Path
Complete event -> backend evaluates achievement -> badge modal -> profile updated -> analytics logged.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Journey 8: Lost Streak Recovery
User misses day -> show encouragement -> optional streak freeze later -> restart mission without shame.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
User misses day
Happy Path
User misses day -> show encouragement -> optional streak freeze later -> restart mission without shame.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Journey 9: Child Account Under Parent
Parent creates family account -> adds child -> child uses app -> parent sees summary but not invasive data.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
Parent creates family account
Happy Path
Parent creates family account -> adds child -> child uses app -> parent sees summary but not invasive data.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Journey 10: Language Pack Learner
Select Spanish/Hebrew pack -> scan tile -> see word, translation, pronunciation, example -> repeat aloud -> quiz.
The app should guide the user through this journey with clear primary actions, fast loading, friendly feedback, and saved progress. Every step must have an error state and an empty state.
• Must be testable by QA.
• Must create analytics events at key points.
• Must update user progress if a learning event occurs.
• Must support child-safe language and design.
Area
Specification
Entry Point
Select Spanish/Hebrew pack
Happy Path
Select Spanish/Hebrew pack -> scan tile -> see word, translation, pronunciation, example -> repeat aloud -> quiz.
Completion Event
User sees progress, XP, badge, streak, or saved result.

Screen 1: Splash Screen
Brand moment while app initializes
Entry: Check auth session, load remote config, preload assets.
Content: LexLoo logo, tagline Learn. Wear. Master., loading indicator.
Primary actions: Auto-route to onboarding, login, or home.
Build notes: If network unavailable, continue to cached login where possible.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Brand moment while app initializes
Entry Point
Check auth session, load remote config, preload assets
Primary Content
LexLoo logo, tagline Learn. Wear. Master., loading indicator
Primary Actions
Auto-route to onboarding, login, or home
Acceptance Criteria
If network unavailable, continue to cached login where possible

Screen 2: Welcome Screen
Explain product in one sentence
Entry: New users.
Content: Headline: Wear words. Scan words. Master words..
Primary actions: Get Started, Log In.
Build notes: Show three visual steps: choose, wear, learn.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Explain product in one sentence
Entry Point
New users
Primary Content
Headline: Wear words. Scan words. Master words.
Primary Actions
Get Started, Log In
Acceptance Criteria
Show three visual steps: choose, wear, learn

Screen 3: Create Account
Register user
Entry: Email/password or social auth.
Content: Name, email, password, role selection.
Primary actions: Create Account.
Build notes: Validate email, password strength, duplicate account.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Register user
Entry Point
Email/password or social auth
Primary Content
Name, email, password, role selection
Primary Actions
Create Account
Acceptance Criteria
Validate email, password strength, duplicate account

Screen 4: Login
Existing user access
Entry: Auth service.
Content: Email, password, forgot password.
Primary actions: Log In.
Build notes: Friendly error, reset password flow.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Existing user access
Entry Point
Auth service
Primary Content
Email, password, forgot password
Primary Actions
Log In
Acceptance Criteria
Friendly error, reset password flow

Screen 5: Role Selection
Set account context
Entry: During onboarding.
Content: Student, Parent, Adult Learner.
Primary actions: Continue.
Build notes: Parent can create child profile later.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Set account context
Entry Point
During onboarding
Primary Content
Student, Parent, Adult Learner
Primary Actions
Continue
Acceptance Criteria
Parent can create child profile later

Screen 6: Age/Grade Selection
Personalize difficulty
Entry: Student/adult profile.
Content: Age range, grade, learning level.
Primary actions: Continue.
Build notes: Can skip with default level.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Personalize difficulty
Entry Point
Student/adult profile
Primary Content
Age range, grade, learning level
Primary Actions
Continue
Acceptance Criteria
Can skip with default level

Screen 7: Learning Goal Selection
Choose pack focus
Entry: Onboarding.
Content: English Vocabulary, SAT, Spanish, Hebrew, Beginner Languages.
Primary actions: Continue.
Build notes: Supports multiple goals.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Choose pack focus
Entry Point
Onboarding
Primary Content
English Vocabulary, SAT, Spanish, Hebrew, Beginner Languages
Primary Actions
Continue
Acceptance Criteria
Supports multiple goals

Screen 8: Reminder Time Setup
Create daily habit
Entry: Onboarding.
Content: Time picker, notification permission explanation.
Primary actions: Enable Reminders, Skip.
Build notes: Do not block use if denied.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Create daily habit
Entry Point
Onboarding
Primary Content
Time picker, notification permission explanation
Primary Actions
Enable Reminders, Skip
Acceptance Criteria
Do not block use if denied

Screen 9: Onboarding Complete
Celebrate readiness
Entry: After setup.
Content: Summary of selected goal, first mission.
Primary actions: Scan First Tile.
Build notes: Route to scanner.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Celebrate readiness
Entry Point
After setup
Primary Content
Summary of selected goal, first mission
Primary Actions
Scan First Tile
Acceptance Criteria
Route to scanner

Screen 10: Home Dashboard
Daily learning hub
Entry: Authenticated user.
Content: Streak, XP, daily mission, Wear of Day, continue learning.
Primary actions: Scan Tile, Practice, View Progress.
Build notes: Must be usable in 5 seconds.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Daily learning hub
Entry Point
Authenticated user
Primary Content
Streak, XP, daily mission, Wear of Day, continue learning
Primary Actions
Scan Tile, Practice, View Progress
Acceptance Criteria
Must be usable in 5 seconds

Screen 11: Wear of the Day Card
Recommend a tile to wear
Entry: Home.
Content: Word, short reason, pack, difficulty.
Primary actions: Wear This Word, Learn More.
Build notes: Uses recommendation engine or fallback word.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Recommend a tile to wear
Entry Point
Home
Primary Content
Word, short reason, pack, difficulty
Primary Actions
Wear This Word, Learn More
Acceptance Criteria
Uses recommendation engine or fallback word

Screen 12: Word of the Day Card
Daily new word
Entry: Home.
Content: Word, definition, pronunciation icon.
Primary actions: Learn Today.
Build notes: May be independent from scanned tiles.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Daily new word
Entry Point
Home
Primary Content
Word, definition, pronunciation icon
Primary Actions
Learn Today
Acceptance Criteria
May be independent from scanned tiles

Screen 13: Daily Missions Panel
Show what to do today
Entry: Home.
Content: Learn 3 words, complete quiz, scan tile.
Primary actions: Start Mission.
Build notes: Progress indicators.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Show what to do today
Entry Point
Home
Primary Content
Learn 3 words, complete quiz, scan tile
Primary Actions
Start Mission
Acceptance Criteria
Progress indicators

Screen 14: Scanner Entry
Camera scan mode
Entry: Scan button.
Content: Camera view, frame, torch, manual entry.
Primary actions: Scan, Enter Code.
Build notes: Permission prompts.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Camera scan mode
Entry Point
Scan button
Primary Content
Camera view, frame, torch, manual entry
Primary Actions
Scan, Enter Code
Acceptance Criteria
Permission prompts

Screen 15: Camera Permission Screen
Explain need for camera
Entry: Scanner first use.
Content: Message: scan physical LexLoo tiles.
Primary actions: Allow Camera.
Build notes: If denied show manual code option.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Explain need for camera
Entry Point
Scanner first use
Primary Content
Message: scan physical LexLoo tiles
Primary Actions
Allow Camera
Acceptance Criteria
If denied show manual code option

Screen 16: QR Scan Success
Resolve tile code
Entry: Scanner.
Content: Quick animation, word title.
Primary actions: Open Word.
Build notes: Auto-open after short delay.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Resolve tile code
Entry Point
Scanner
Primary Content
Quick animation, word title
Primary Actions
Open Word
Acceptance Criteria
Auto-open after short delay

Screen 17: QR Scan Error
Handle invalid/unreadable code
Entry: Scanner.
Content: Error message, retry tips.
Primary actions: Try Again, Enter Code.
Build notes: Do not blame user.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Handle invalid/unreadable code
Entry Point
Scanner
Primary Content
Error message, retry tips
Primary Actions
Try Again, Enter Code
Acceptance Criteria
Do not blame user

Screen 18: Manual Code Entry
Fallback code path
Entry: Scanner.
Content: Input field, format helper.
Primary actions: Submit Code.
Build notes: Validate and resolve.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Fallback code path
Entry Point
Scanner
Primary Content
Input field, format helper
Primary Actions
Submit Code
Acceptance Criteria
Validate and resolve

Screen 19: Word Detail Overview
Core learning screen
Entry: Tile or word record.
Content: Word, pronunciation, definition, short explanation, example.
Primary actions: Practice, Save, Mark Learned.
Build notes: Most important screen in app.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Core learning screen
Entry Point
Tile or word record
Primary Content
Word, pronunciation, definition, short explanation, example
Primary Actions
Practice, Save, Mark Learned
Acceptance Criteria
Most important screen in app

Screen 20: Word Detail Definition Tab
Teach meaning
Entry: Word detail.
Content: Long definition, simple definition, part of speech.
Primary actions: Practice Definition.
Build notes: Support age-level explanation later.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Teach meaning
Entry Point
Word detail
Primary Content
Long definition, simple definition, part of speech
Primary Actions
Practice Definition
Acceptance Criteria
Support age-level explanation later

Screen 21: Word Detail Translation Tab
Language learning
Entry: Language pack word.
Content: Translations, transliteration if needed, examples.
Primary actions: Practice Translation.
Build notes: Show only when applicable.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Language learning
Entry Point
Language pack word
Primary Content
Translations, transliteration if needed, examples
Primary Actions
Practice Translation
Acceptance Criteria
Show only when applicable

Screen 22: Word Detail Pronunciation
Audio learning
Entry: Word detail.
Content: Audio button, phonetic spelling, repeat prompt.
Primary actions: Play Audio, I Said It.
Build notes: Track play event.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Audio learning
Entry Point
Word detail
Primary Content
Audio button, phonetic spelling, repeat prompt
Primary Actions
Play Audio, I Said It
Acceptance Criteria
Track play event

Screen 23: Word Detail Examples
Use word in context
Entry: Word detail.
Content: 3 example sentences by level.
Primary actions: Practice Sentence.
Build notes: Future AI personalized examples.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Use word in context
Entry Point
Word detail
Primary Content
3 example sentences by level
Primary Actions
Practice Sentence
Acceptance Criteria
Future AI personalized examples

Screen 24: Word Detail Synonyms
Expand vocabulary
Entry: Word detail.
Content: Synonyms, antonyms.
Primary actions: Study Related Words.
Build notes: Clickable later.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Expand vocabulary
Entry Point
Word detail
Primary Content
Synonyms, antonyms
Primary Actions
Study Related Words
Acceptance Criteria
Clickable later

Screen 25: Word Origin Mini Card
Add memory hook
Entry: Word detail.
Content: Basic origin and fun fact.
Primary actions: Save Note.
Build notes: Keep short for MVP.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Add memory hook
Entry Point
Word detail
Primary Content
Basic origin and fun fact
Primary Actions
Save Note
Acceptance Criteria
Keep short for MVP

Screen 26: Save Word Confirmation
Saved/favorite feedback
Entry: Word detail save action.
Content: Toast or small animation.
Primary actions: View Saved.
Build notes: Update saved_words table.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Saved/favorite feedback
Entry Point
Word detail save action
Primary Content
Toast or small animation
Primary Actions
View Saved
Acceptance Criteria
Update saved_words table

Screen 27: Mark Learned Flow
User declares learning
Entry: Word detail.
Content: Confirmation message.
Primary actions: Mark Learned.
Build notes: May require activity completion for mastery.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
User declares learning
Entry Point
Word detail
Primary Content
Confirmation message
Primary Actions
Mark Learned
Acceptance Criteria
May require activity completion for mastery

Screen 28: Mastery Criteria Modal
Explain mastery
Entry: Before mark mastered.
Content: Definition: mastered after repeated success.
Primary actions: Continue Practicing.
Build notes: Avoid fake mastery.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Explain mastery
Entry Point
Before mark mastered
Primary Content
Definition: mastered after repeated success
Primary Actions
Continue Practicing
Acceptance Criteria
Avoid fake mastery

Screen 29: Flashcard Game Start
Practice mode
Entry: From word detail or practice tab.
Content: Card count, pack, estimated time.
Primary actions: Start.
Build notes: Short sessions only.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Practice mode
Entry Point
From word detail or practice tab
Primary Content
Card count, pack, estimated time
Primary Actions
Start
Acceptance Criteria
Short sessions only

Screen 30: Flashcard Card
Active recall
Entry: Game.
Content: Word on front, reveal definition.
Primary actions: Flip, Know It, Need Review.
Build notes: Record response.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Active recall
Entry Point
Game
Primary Content
Word on front, reveal definition
Primary Actions
Flip, Know It, Need Review
Acceptance Criteria
Record response

Screen 31: Flashcard Results
Summarize session
Entry: Game completion.
Content: Correct/unknown, XP, words reviewed.
Primary actions: Continue, Review Weak Words.
Build notes: Update progress.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Summarize session
Entry Point
Game completion
Primary Content
Correct/unknown, XP, words reviewed
Primary Actions
Continue, Review Weak Words
Acceptance Criteria
Update progress

Screen 32: Multiple Choice Quiz Start
Quiz setup
Entry: Practice.
Content: Word or pack, number of questions.
Primary actions: Start Quiz.
Build notes: Use generated distractors.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Quiz setup
Entry Point
Practice
Primary Content
Word or pack, number of questions
Primary Actions
Start Quiz
Acceptance Criteria
Use generated distractors

Screen 33: Multiple Choice Question
Assess recognition
Entry: Quiz.
Content: Prompt, 4 choices.
Primary actions: Submit.
Build notes: Immediate feedback.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Assess recognition
Entry Point
Quiz
Primary Content
Prompt, 4 choices
Primary Actions
Submit
Acceptance Criteria
Immediate feedback

Screen 34: Multiple Choice Feedback
Teach after answer
Entry: Quiz.
Content: Correct/incorrect, explanation.
Primary actions: Next.
Build notes: No shame language.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Teach after answer
Entry Point
Quiz
Primary Content
Correct/incorrect, explanation
Primary Actions
Next
Acceptance Criteria
No shame language

Screen 35: Quiz Results
End of quiz
Entry: Quiz.
Content: Score, XP, streak progress.
Primary actions: Done, Practice Again.
Build notes: Award badges if applicable.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
End of quiz
Entry Point
Quiz
Primary Content
Score, XP, streak progress
Primary Actions
Done, Practice Again
Acceptance Criteria
Award badges if applicable

Screen 36: Match Definition Game
Matching practice
Entry: Practice.
Content: Words and definitions.
Primary actions: Submit Matches.
Build notes: Good for pack review.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Matching practice
Entry Point
Practice
Primary Content
Words and definitions
Primary Actions
Submit Matches
Acceptance Criteria
Good for pack review

Screen 37: Spelling Challenge
Input practice
Entry: Practice.
Content: Audio/definition prompt, text input.
Primary actions: Check.
Build notes: Support hints.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Input practice
Entry Point
Practice
Primary Content
Audio/definition prompt, text input
Primary Actions
Check
Acceptance Criteria
Support hints

Screen 38: Sentence Builder
Future/optional practice
Entry: Practice.
Content: Word prompt, sentence input.
Primary actions: Submit Sentence.
Build notes: AI evaluation later.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Future/optional practice
Entry Point
Practice
Primary Content
Word prompt, sentence input
Primary Actions
Submit Sentence
Acceptance Criteria
AI evaluation later

Screen 39: Practice Hub
Choose activity
Entry: Bottom nav.
Content: Flashcards, quiz, spelling, match.
Primary actions: Start selected.
Build notes: Personalized recommendations later.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Choose activity
Entry Point
Bottom nav
Primary Content
Flashcards, quiz, spelling, match
Primary Actions
Start selected
Acceptance Criteria
Personalized recommendations later

Screen 40: Progress Dashboard
User progress overview
Entry: Bottom nav.
Content: Words scanned, learned, mastered, XP, streak.
Primary actions: View Details.
Build notes: Clear metrics.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
User progress overview
Entry Point
Bottom nav
Primary Content
Words scanned, learned, mastered, XP, streak
Primary Actions
View Details
Acceptance Criteria
Clear metrics

Screen 41: Progress by Pack
Pack progress
Entry: Progress.
Content: Pack cards with completion bars.
Primary actions: Open Pack.
Build notes: Sort by active packs.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Pack progress
Entry Point
Progress
Primary Content
Pack cards with completion bars
Primary Actions
Open Pack
Acceptance Criteria
Sort by active packs

Screen 42: Learning History
Timeline
Entry: Profile/progress.
Content: Recent scans, quizzes, mastery.
Primary actions: Open item.
Build notes: Useful for parents too.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Timeline
Entry Point
Profile/progress
Primary Content
Recent scans, quizzes, mastery
Primary Actions
Open item
Acceptance Criteria
Useful for parents too

Screen 43: Saved Words
Personal vocabulary list
Entry: Profile.
Content: Saved/favorite words, filters.
Primary actions: Practice Saved.
Build notes: Must work offline-ish.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Personal vocabulary list
Entry Point
Profile
Primary Content
Saved/favorite words, filters
Primary Actions
Practice Saved
Acceptance Criteria
Must work offline-ish

Screen 44: Favorite Word Detail
Saved word drill-in
Entry: Saved words.
Content: Word summary and status.
Primary actions: Practice, Remove Save.
Build notes: Avoid duplicate screens if possible.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Saved word drill-in
Entry Point
Saved words
Primary Content
Word summary and status
Primary Actions
Practice, Remove Save
Acceptance Criteria
Avoid duplicate screens if possible

Screen 45: Achievements Screen
Badges and milestones
Entry: Profile.
Content: Unlocked and locked badges.
Primary actions: Share later.
Build notes: Locked badges show requirements.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Badges and milestones
Entry Point
Profile
Primary Content
Unlocked and locked badges
Primary Actions
Share later
Acceptance Criteria
Locked badges show requirements

Screen 46: Badge Unlock Modal
Reward moment
Entry: After event.
Content: Badge art, title, XP reward.
Primary actions: Awesome.
Build notes: Short and celebratory.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Reward moment
Entry Point
After event
Primary Content
Badge art, title, XP reward
Primary Actions
Awesome
Acceptance Criteria
Short and celebratory

Screen 47: Levels Screen
Learning identity
Entry: Profile.
Content: Explorer -> Scholar -> Wordsmith -> Linguist -> Master -> LexLoo Legend.
Primary actions: View Benefits.
Build notes: Mostly motivational MVP.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Learning identity
Entry Point
Profile
Primary Content
Explorer -> Scholar -> Wordsmith -> Linguist -> Master -> LexLoo Legend
Primary Actions
View Benefits
Acceptance Criteria
Mostly motivational MVP

Screen 48: XP Ledger
Transparency
Entry: Profile.
Content: XP history by event.
Primary actions: Back.
Build notes: Optional but helpful for debugging.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Transparency
Entry Point
Profile
Primary Content
XP history by event
Primary Actions
Back
Acceptance Criteria
Optional but helpful for debugging

Screen 49: Streak Screen
Habit detail
Entry: Home/profile.
Content: Current streak, longest streak, calendar.
Primary actions: Keep Going.
Build notes: Explain streak rules.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Habit detail
Entry Point
Home/profile
Primary Content
Current streak, longest streak, calendar
Primary Actions
Keep Going
Acceptance Criteria
Explain streak rules

Screen 50: Notifications Settings
Reminder control
Entry: Settings.
Content: Daily word, streak reminder, parent summary.
Primary actions: Save.
Build notes: Respect OS permissions.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Reminder control
Entry Point
Settings
Primary Content
Daily word, streak reminder, parent summary
Primary Actions
Save
Acceptance Criteria
Respect OS permissions

Screen 51: Profile Screen
User identity
Entry: Bottom nav.
Content: Name, level, avatar, stats.
Primary actions: Edit Profile.
Build notes: Child-safe avatars.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
User identity
Entry Point
Bottom nav
Primary Content
Name, level, avatar, stats
Primary Actions
Edit Profile
Acceptance Criteria
Child-safe avatars

Screen 52: Edit Profile
Manage account
Entry: Profile.
Content: Name, avatar, learning goal.
Primary actions: Save.
Build notes: No sensitive info for children.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Manage account
Entry Point
Profile
Primary Content
Name, avatar, learning goal
Primary Actions
Save
Acceptance Criteria
No sensitive info for children

Screen 53: Settings
App settings
Entry: Profile.
Content: Account, notifications, privacy, help.
Primary actions: Open selected.
Build notes: Simple list.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
App settings
Entry Point
Profile
Primary Content
Account, notifications, privacy, help
Primary Actions
Open selected
Acceptance Criteria
Simple list

Screen 54: Help Center
Support
Entry: Settings.
Content: FAQ, contact, scan tips.
Primary actions: Contact Support.
Build notes: Include manufacturing/app support separation.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Support
Entry Point
Settings
Primary Content
FAQ, contact, scan tips
Primary Actions
Contact Support
Acceptance Criteria
Include manufacturing/app support separation

Screen 55: Pack Library
Browse available packs
Entry: Home/practice.
Content: English, SAT, Spanish, Hebrew packs.
Primary actions: Open Pack.
Build notes: MVP can show included packs.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Browse available packs
Entry Point
Home/practice
Primary Content
English, SAT, Spanish, Hebrew packs
Primary Actions
Open Pack
Acceptance Criteria
MVP can show included packs

Screen 56: Pack Detail
View pack contents
Entry: Pack library.
Content: Description, word count, level, words.
Primary actions: Start Pack, Scan Tiles.
Build notes: Purchase later.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
View pack contents
Entry Point
Pack library
Primary Content
Description, word count, level, words
Primary Actions
Start Pack, Scan Tiles
Acceptance Criteria
Purchase later

Screen 57: Pack Word List
Browse words
Entry: Pack detail.
Content: Searchable list.
Primary actions: Open Word.
Build notes: Progress status per word.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Browse words
Entry Point
Pack detail
Primary Content
Searchable list
Primary Actions
Open Word
Acceptance Criteria
Progress status per word

Screen 58: Tile Not Owned State
Code belongs to pack user may not own
Entry: Scanner resolution.
Content: Explain pack requirement.
Primary actions: Unlock Pack, Back.
Build notes: MVP may simply allow access.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Code belongs to pack user may not own
Entry Point
Scanner resolution
Primary Content
Explain pack requirement
Primary Actions
Unlock Pack, Back
Acceptance Criteria
MVP may simply allow access

Screen 59: Parent Dashboard Home
Parent overview
Entry: Parent role.
Content: Children cards, weekly summary.
Primary actions: Open Child.
Build notes: Clean and reassuring.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Parent overview
Entry Point
Parent role
Primary Content
Children cards, weekly summary
Primary Actions
Open Child
Acceptance Criteria
Clean and reassuring

Screen 60: Parent Child Detail
Specific child progress
Entry: Parent.
Content: Stats, mastered words, streak, recent activity.
Primary actions: Send Encouragement.
Build notes: No invasive surveillance.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Specific child progress
Entry Point
Parent
Primary Content
Stats, mastered words, streak, recent activity
Primary Actions
Send Encouragement
Acceptance Criteria
No invasive surveillance

Screen 61: Parent Weekly Report
Summary view
Entry: Parent.
Content: Words learned, streak, badges, suggested focus.
Primary actions: Share/Email later.
Build notes: MVP in-app only.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Summary view
Entry Point
Parent
Primary Content
Words learned, streak, badges, suggested focus
Primary Actions
Share/Email later
Acceptance Criteria
MVP in-app only

Screen 62: Add Child Profile
Family setup
Entry: Parent.
Content: Child name, age/grade, goals.
Primary actions: Create Child.
Build notes: Privacy mindful.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Family setup
Entry Point
Parent
Primary Content
Child name, age/grade, goals
Primary Actions
Create Child
Acceptance Criteria
Privacy mindful

Screen 63: Switch Child Profile
Multi-child account
Entry: Parent/student.
Content: Child selector.
Primary actions: Switch.
Build notes: Used on shared devices.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Multi-child account
Entry Point
Parent/student
Primary Content
Child selector
Primary Actions
Switch
Acceptance Criteria
Used on shared devices

Screen 64: Admin Login
Internal access
Entry: Admin URL.
Content: Email/password, role check.
Primary actions: Log In.
Build notes: Separate from child app if possible.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Internal access
Entry Point
Admin URL
Primary Content
Email/password, role check
Primary Actions
Log In
Acceptance Criteria
Separate from child app if possible

Screen 65: Admin Dashboard
Operations overview
Entry: Admin.
Content: Users, words, packs, tile scans, errors.
Primary actions: Manage Content.
Build notes: Web app recommended.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Operations overview
Entry Point
Admin
Primary Content
Users, words, packs, tile scans, errors
Primary Actions
Manage Content
Acceptance Criteria
Web app recommended

Screen 66: Admin Word List
Manage words
Entry: Admin.
Content: Search/filter words.
Primary actions: Add Word, Edit.
Build notes: No code deploy needed.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Manage words
Entry Point
Admin
Primary Content
Search/filter words
Primary Actions
Add Word, Edit
Acceptance Criteria
No code deploy needed

Screen 67: Admin Word Editor
Create/edit word
Entry: Admin.
Content: Word fields, pronunciation, translations, examples.
Primary actions: Save Draft, Publish.
Build notes: Validation required.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Create/edit word
Entry Point
Admin
Primary Content
Word fields, pronunciation, translations, examples
Primary Actions
Save Draft, Publish
Acceptance Criteria
Validation required

Screen 68: Admin Pack List
Manage packs
Entry: Admin.
Content: Pack name, language, level, status.
Primary actions: Create Pack.
Build notes: Publish workflow.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Manage packs
Entry Point
Admin
Primary Content
Pack name, language, level, status
Primary Actions
Create Pack
Acceptance Criteria
Publish workflow

Screen 69: Admin Pack Editor
Build pack
Entry: Admin.
Content: Pack metadata, words, order, SKU.
Primary actions: Save, Publish.
Build notes: Can assign words to pack.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Build pack
Entry Point
Admin
Primary Content
Pack metadata, words, order, SKU
Primary Actions
Save, Publish
Acceptance Criteria
Can assign words to pack

Screen 70: Admin Tile Code List
Manage physical codes
Entry: Admin.
Content: Tile code, word, pack, status.
Primary actions: Assign, Export.
Build notes: Critical for manufacturing.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Manage physical codes
Entry Point
Admin
Primary Content
Tile code, word, pack, status
Primary Actions
Assign, Export
Acceptance Criteria
Critical for manufacturing

Screen 71: Admin Tile Assignment
Map code to word
Entry: Admin.
Content: Code input, word selector, batch import.
Primary actions: Assign.
Build notes: Prevents duplicate assignment.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Map code to word
Entry Point
Admin
Primary Content
Code input, word selector, batch import
Primary Actions
Assign
Acceptance Criteria
Prevents duplicate assignment

Screen 72: Admin QR Batch Generator
Prepare manufacturing data
Entry: Admin.
Content: Generate/export unique codes.
Primary actions: Export CSV.
Build notes: Can later generate QR images.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Prepare manufacturing data
Entry Point
Admin
Primary Content
Generate/export unique codes
Primary Actions
Export CSV
Acceptance Criteria
Can later generate QR images

Screen 73: Admin Analytics
Learning and scan metrics
Entry: Admin.
Content: Scans, active users, pack use, errors.
Primary actions: Export.
Build notes: MVP basic charts.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Learning and scan metrics
Entry Point
Admin
Primary Content
Scans, active users, pack use, errors
Primary Actions
Export
Acceptance Criteria
MVP basic charts

Screen 74: Admin User Search
Support users
Entry: Admin.
Content: Search users, profiles, progress summary.
Primary actions: Open User.
Build notes: Privacy controls.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Support users
Entry Point
Admin
Primary Content
Search users, profiles, progress summary
Primary Actions
Open User
Acceptance Criteria
Privacy controls

Screen 75: Admin Content QA
Review before publish
Entry: Admin.
Content: Missing audio, missing definition, invalid translation.
Primary actions: Fix.
Build notes: Prevent bad tile experience.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Review before publish
Entry Point
Admin
Primary Content
Missing audio, missing definition, invalid translation
Primary Actions
Fix
Acceptance Criteria
Prevent bad tile experience

Screen 76: Error Boundary Screen
Unexpected error
Entry: Global.
Content: Friendly message.
Primary actions: Go Home, Report.
Build notes: Do not crash silently.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Unexpected error
Entry Point
Global
Primary Content
Friendly message
Primary Actions
Go Home, Report
Acceptance Criteria
Do not crash silently

Screen 77: Offline Mode Notice
Weak connection
Entry: Global.
Content: Limited access message.
Primary actions: Retry.
Build notes: Cached saved words later.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Weak connection
Entry Point
Global
Primary Content
Limited access message
Primary Actions
Retry
Acceptance Criteria
Cached saved words later

Screen 78: Empty State Generic
No content yet
Entry: Reusable.
Content: Friendly illustration/message.
Primary actions: Primary action.
Build notes: Every list needs empty state.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
No content yet
Entry Point
Reusable
Primary Content
Friendly illustration/message
Primary Actions
Primary action
Acceptance Criteria
Every list needs empty state

Screen 79: Loading State Generic
Wait state
Entry: Reusable.
Content: Skeleton cards or spinner.
Primary actions: None.
Build notes: Avoid blank screens.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Wait state
Entry Point
Reusable
Primary Content
Skeleton cards or spinner
Primary Actions
None
Acceptance Criteria
Avoid blank screens

Screen 80: Maintenance Mode
Planned outage
Entry: Global.
Content: Clear message.
Primary actions: Retry later.
Build notes: Feature flag controlled.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Planned outage
Entry Point
Global
Primary Content
Clear message
Primary Actions
Retry later
Acceptance Criteria
Feature flag controlled

Screen 81: Privacy Consent
Child/family data notice
Entry: Onboarding/settings.
Content: Simple privacy summary.
Primary actions: Accept.
Build notes: Required before child usage.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Child/family data notice
Entry Point
Onboarding/settings
Primary Content
Simple privacy summary
Primary Actions
Accept
Acceptance Criteria
Required before child usage

Screen 82: Terms Acceptance
Legal acceptance
Entry: Onboarding.
Content: Links to terms/privacy.
Primary actions: Accept.
Build notes: Store timestamp.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Legal acceptance
Entry Point
Onboarding
Primary Content
Links to terms/privacy
Primary Actions
Accept
Acceptance Criteria
Store timestamp

Screen 83: Delete Account
Account closure
Entry: Settings.
Content: Warning and confirmation.
Primary actions: Delete.
Build notes: Soft delete first.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Account closure
Entry Point
Settings
Primary Content
Warning and confirmation
Primary Actions
Delete
Acceptance Criteria
Soft delete first

Screen 84: App Update Required
Version control
Entry: Startup.
Content: Update message.
Primary actions: Open Store.
Build notes: Remote config.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Version control
Entry Point
Startup
Primary Content
Update message
Primary Actions
Open Store
Acceptance Criteria
Remote config

Screen 85: Feature Coming Soon
Future modules
Entry: Placeholder.
Content: Explain future feature.
Primary actions: Back.
Build notes: Do not tease too much.
• The screen must include loading, error, and empty states where applicable.
• The screen must be tracked with analytics screen_view event.
• The screen must use shared design components, not one-off styling.
• The screen must be responsive across common phone sizes.
Area
Specification
Purpose
Future modules
Entry Point
Placeholder
Primary Content
Explain future feature
Primary Actions
Back
Acceptance Criteria
Do not tease too much

Learning Content 1: Word Object Model
Every word is a structured learning object, not just text.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
Every word is a structured learning object, not just text.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 2: Word Pack Model
Packs group words by language, grade, topic, product SKU, or learning objective.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
Packs group words by language, grade, topic, product SKU, or learning objective.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 3: Tile Object Model
A tile is the bridge between physical product and digital learning object.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
A tile is the bridge between physical product and digital learning object.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 4: Difficulty System
Difficulty should support grade level, language level, SAT/ACT level, and internal numeric score.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
Difficulty should support grade level, language level, SAT/ACT level, and internal numeric score.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 5: Pronunciation System
Audio files may be uploaded by admin or generated later by text-to-speech.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
Audio files may be uploaded by admin or generated later by text-to-speech.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 6: Translations
Language packs require source language, target language, translation, pronunciation, and examples.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
Language packs require source language, target language, translation, pronunciation, and examples.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 7: Examples
Examples should be age-appropriate and pack-appropriate.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
Examples should be age-appropriate and pack-appropriate.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 8: Synonyms and Antonyms
These strengthen vocabulary depth and support quiz generation.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
These strengthen vocabulary depth and support quiz generation.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 9: Word Origin
Basic etymology improves memory but must remain optional and short.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
Basic etymology improves memory but must remain optional and short.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 10: Mastery Model
Mastery should require repeated successful interactions, not only a user tap.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
Mastery should require repeated successful interactions, not only a user tap.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 11: Review Scheduling
The MVP can use simple review intervals; later versions can use spaced repetition and forgetting prediction.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
The MVP can use simple review intervals; later versions can use spaced repetition and forgetting prediction.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Learning Content 12: Seed Content
MVP should include English Grade 7, SAT advanced, Spanish beginner, and Hebrew beginner samples.
The content system must be editable from the admin dashboard. The mobile app should never require a code deployment to add a new word, pack, translation, or tile mapping. Content quality is central to LexLoo because every scan depends on accurate learning data.
• Required fields should be validated before publishing.
• Draft and published statuses should be separate.
• Changes should be audited.
• A word can belong to many packs.
• A tile resolves to a specific word-pack experience.
Area
Specification
Core Requirement
MVP should include English Grade 7, SAT advanced, Spanish beginner, and Hebrew beginner samples.
MVP Implementation
Store in database with admin CRUD and publish status.
Future Expansion
Support AI-generated explanations, personalized examples, and teacher-created packs.

Database Table 1: users
Fields: id, email, display_name, role, created_at, last_login_at, status
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
users
Representative Fields
id, email, display_name, role, created_at, last_login_at, status
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 2: profiles
Fields: id, user_id, profile_type, name, age_range, grade_level, avatar, active_goal_id
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
profiles
Representative Fields
id, user_id, profile_type, name, age_range, grade_level, avatar, active_goal_id
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 3: parent_child_links
Fields: id, parent_user_id, child_profile_id, relationship, permissions
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
parent_child_links
Representative Fields
id, parent_user_id, child_profile_id, relationship, permissions
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 4: languages
Fields: id, code, name, native_name, direction, active
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
languages
Representative Fields
id, code, name, native_name, direction, active
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 5: word_packs
Fields: id, name, slug, language_id, target_language_id, level, category, sku, status, description
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
word_packs
Representative Fields
id, name, slug, language_id, target_language_id, level, category, sku, status, description
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 6: words
Fields: id, text, normalized_text, language_id, part_of_speech, difficulty_score, grade_level, status
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
words
Representative Fields
id, text, normalized_text, language_id, part_of_speech, difficulty_score, grade_level, status
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 7: word_content
Fields: id, word_id, short_definition, long_definition, phonetic, origin, fun_fact, audio_url
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
word_content
Representative Fields
id, word_id, short_definition, long_definition, phonetic, origin, fun_fact, audio_url
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 8: word_translations
Fields: id, word_id, target_language_id, translation, transliteration, example_translation
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
word_translations
Representative Fields
id, word_id, target_language_id, translation, transliteration, example_translation
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 9: word_examples
Fields: id, word_id, example_text, level, context_tag, age_band
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
word_examples
Representative Fields
id, word_id, example_text, level, context_tag, age_band
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 10: word_relations
Fields: id, word_id, related_word_id, relation_type
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
word_relations
Representative Fields
id, word_id, related_word_id, relation_type
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 11: pack_words
Fields: id, pack_id, word_id, display_order, tile_required, level_label
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
pack_words
Representative Fields
id, pack_id, word_id, display_order, tile_required, level_label
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 12: tiles
Fields: id, tile_code, qr_payload, nfc_payload, pack_id, word_id, status, batch_id
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
tiles
Representative Fields
id, tile_code, qr_payload, nfc_payload, pack_id, word_id, status, batch_id
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 13: tile_batches
Fields: id, batch_name, manufacturer_ref, created_at, exported_at, notes
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
tile_batches
Representative Fields
id, batch_name, manufacturer_ref, created_at, exported_at, notes
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 14: scan_events
Fields: id, user_id, profile_id, tile_id, word_id, scanned_at, source, device_info, result
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
scan_events
Representative Fields
id, user_id, profile_id, tile_id, word_id, scanned_at, source, device_info, result
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 15: user_word_progress
Fields: id, profile_id, word_id, status, mastery_score, last_seen_at, next_review_at
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
user_word_progress
Representative Fields
id, profile_id, word_id, status, mastery_score, last_seen_at, next_review_at
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 16: quiz_sessions
Fields: id, profile_id, activity_type, pack_id, started_at, completed_at, score, xp_awarded
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
quiz_sessions
Representative Fields
id, profile_id, activity_type, pack_id, started_at, completed_at, score, xp_awarded
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 17: quiz_attempts
Fields: id, session_id, word_id, prompt_type, answer, is_correct, response_time_ms
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
quiz_attempts
Representative Fields
id, session_id, word_id, prompt_type, answer, is_correct, response_time_ms
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 18: xp_events
Fields: id, profile_id, event_type, points, source_id, created_at
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
xp_events
Representative Fields
id, profile_id, event_type, points, source_id, created_at
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 19: streaks
Fields: id, profile_id, current_count, longest_count, last_active_date, timezone
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
streaks
Representative Fields
id, profile_id, current_count, longest_count, last_active_date, timezone
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 20: badges
Fields: id, code, name, description, icon_url, requirement_json, active
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
badges
Representative Fields
id, code, name, description, icon_url, requirement_json, active
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 21: user_badges
Fields: id, profile_id, badge_id, earned_at, source_event_id
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
user_badges
Representative Fields
id, profile_id, badge_id, earned_at, source_event_id
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 22: missions
Fields: id, code, title, mission_type, requirement_json, xp_reward, active
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
missions
Representative Fields
id, code, title, mission_type, requirement_json, xp_reward, active
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 23: user_missions
Fields: id, profile_id, mission_id, progress_json, status, started_at, completed_at
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
user_missions
Representative Fields
id, profile_id, mission_id, progress_json, status, started_at, completed_at
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 24: notifications
Fields: id, profile_id, type, scheduled_for, sent_at, status, payload_json
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
notifications
Representative Fields
id, profile_id, type, scheduled_for, sent_at, status, payload_json
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 25: admin_audit_logs
Fields: id, admin_user_id, action, entity_type, entity_id, before_json, after_json, created_at
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
admin_audit_logs
Representative Fields
id, admin_user_id, action, entity_type, entity_id, before_json, after_json, created_at
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 26: feature_flags
Fields: id, key, description, enabled, rollout_json
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
feature_flags
Representative Fields
id, key, description, enabled, rollout_json
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

Database Table 27: analytics_events
Fields: id, user_id, profile_id, event_name, properties_json, created_at
This table is part of the core LexLoo app architecture. It should be created through database migrations and accessed through typed service functions. Never access data directly from arbitrary UI components without a service layer.
• Use UUID primary keys unless the backend platform strongly suggests otherwise.
• Include created_at and updated_at where useful.
• Apply row-level security for user-owned records.
• Admin-only tables must require admin role checks.
Area
Specification
Table Name
analytics_events
Representative Fields
id, user_id, profile_id, event_name, properties_json, created_at
Security
Apply least-privilege access rules.
Testing
Create seed records and verify CRUD behavior.

API 1: GET /auth
List or fetch auth resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/auth
Purpose
List or fetch auth resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 2: POST /auth
Create or trigger auth action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/auth
Purpose
Create or trigger auth action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 3: PATCH /auth/:id
Update auth resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/auth/:id
Purpose
Update auth resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 4: GET /profiles
List or fetch profiles resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/profiles
Purpose
List or fetch profiles resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 5: POST /profiles
Create or trigger profiles action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/profiles
Purpose
Create or trigger profiles action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 6: PATCH /profiles/:id
Update profiles resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/profiles/:id
Purpose
Update profiles resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 7: GET /parents
List or fetch parents resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/parents
Purpose
List or fetch parents resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 8: POST /parents
Create or trigger parents action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/parents
Purpose
Create or trigger parents action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 9: PATCH /parents/:id
Update parents resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/parents/:id
Purpose
Update parents resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 10: GET /packs
List or fetch packs resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/packs
Purpose
List or fetch packs resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 11: POST /packs
Create or trigger packs action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/packs
Purpose
Create or trigger packs action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 12: PATCH /packs/:id
Update packs resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/packs/:id
Purpose
Update packs resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 13: GET /words
List or fetch words resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/words
Purpose
List or fetch words resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 14: POST /words
Create or trigger words action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/words
Purpose
Create or trigger words action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 15: PATCH /words/:id
Update words resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/words/:id
Purpose
Update words resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 16: GET /tiles
List or fetch tiles resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/tiles
Purpose
List or fetch tiles resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 17: POST /tiles
Create or trigger tiles action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/tiles
Purpose
Create or trigger tiles action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 18: PATCH /tiles/:id
Update tiles resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/tiles/:id
Purpose
Update tiles resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 19: GET /scans
List or fetch scans resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/scans
Purpose
List or fetch scans resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 20: POST /scans
Create or trigger scans action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/scans
Purpose
Create or trigger scans action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 21: PATCH /scans/:id
Update scans resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/scans/:id
Purpose
Update scans resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 22: GET /progress
List or fetch progress resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/progress
Purpose
List or fetch progress resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 23: POST /progress
Create or trigger progress action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/progress
Purpose
Create or trigger progress action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 24: PATCH /progress/:id
Update progress resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/progress/:id
Purpose
Update progress resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 25: GET /practice
List or fetch practice resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/practice
Purpose
List or fetch practice resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 26: POST /practice
Create or trigger practice action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/practice
Purpose
Create or trigger practice action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 27: PATCH /practice/:id
Update practice resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/practice/:id
Purpose
Update practice resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 28: GET /xp
List or fetch xp resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/xp
Purpose
List or fetch xp resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 29: POST /xp
Create or trigger xp action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/xp
Purpose
Create or trigger xp action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 30: PATCH /xp/:id
Update xp resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/xp/:id
Purpose
Update xp resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 31: GET /streaks
List or fetch streaks resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/streaks
Purpose
List or fetch streaks resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 32: POST /streaks
Create or trigger streaks action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/streaks
Purpose
Create or trigger streaks action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 33: PATCH /streaks/:id
Update streaks resource where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
PATCH
Path
/streaks/:id
Purpose
Update streaks resource where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 34: GET /badges
List or fetch badges resources based on role and filters.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
GET
Path
/badges
Purpose
List or fetch badges resources based on role and filters.
Response Shape
{ success, data, error, meta } or platform equivalent.

API 35: POST /badges
Create or trigger badges action where permitted.
The backend API should be typed, validated, and protected by authentication. The frontend should call a service function rather than embedding raw API calls throughout UI components.
• Validate request body.
• Authorize based on role and record ownership.
• Return predictable error shape.
• Log important mutations.
• Include tests for success and failure cases.
Area
Specification
Method
POST
Path
/badges
Purpose
Create or trigger badges action where permitted.
Response Shape
{ success, data, error, meta } or platform equivalent.

Habit Engine 1: XP System
Award XP for scans, practice completion, correct answers, streak continuation, and mastery milestones.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
XP System
Rule
Award XP for scans, practice completion, correct answers, streak continuation, and mastery milestones.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Habit Engine 2: Streak System
Count daily learning activity based on user timezone and fair completion windows.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
Streak System
Rule
Count daily learning activity based on user timezone and fair completion windows.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Habit Engine 3: Badge System
Unlock achievement badges like First Scan, 7-Day Streak, 50 Words Learned, and 100 Words Mastered.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
Badge System
Rule
Unlock achievement badges like First Scan, 7-Day Streak, 50 Words Learned, and 100 Words Mastered.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Habit Engine 4: Levels
Use identity levels: Explorer, Scholar, Wordsmith, Linguist, Master, LexLoo Legend.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
Levels
Rule
Use identity levels: Explorer, Scholar, Wordsmith, Linguist, Master, LexLoo Legend.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Habit Engine 5: Daily Missions
Generate simple daily missions such as scan one tile, learn three words, complete one quiz.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
Daily Missions
Rule
Generate simple daily missions such as scan one tile, learn three words, complete one quiz.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Habit Engine 6: Weekly Missions
Future: master 20 words, maintain streak, complete 5 quizzes.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
Weekly Missions
Rule
Future: master 20 words, maintain streak, complete 5 quizzes.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Habit Engine 7: Reward Modals
Rewards should be celebratory but fast; no long interruptions.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
Reward Modals
Rule
Rewards should be celebratory but fast; no long interruptions.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Habit Engine 8: Weak Word Detection
Track incorrect attempts and resurface weak words.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
Weak Word Detection
Rule
Track incorrect attempts and resurface weak words.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Habit Engine 9: Wear of the Day
Recommend a word to physically wear based on goal, weakness, or daily theme.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
Wear of the Day
Rule
Recommend a word to physically wear based on goal, weakness, or daily theme.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Habit Engine 10: Streak Recovery
Future streak freezes can protect motivation, but MVP can simply encourage restart.
The habit engine is what turns LexLoo from a scan utility into a daily learning product. The MVP should keep the logic simple and transparent while preserving extensibility for AI personalization later.
• Must update immediately after learning event.
• Must avoid unfair streak loss due to timezone issues.
• Must be visible on home and profile.
• Must create analytics events for retention analysis.
Area
Specification
Feature
Streak Recovery
Rule
Future streak freezes can protect motivation, but MVP can simply encourage restart.
MVP Complexity
Simple, deterministic, testable.
Future
Personalized recommendations and AI memory engine.

Design System 1: Color System
Deep navy background, electric blue primary accent, orange reward accent, white text, soft gray cards.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Color System
Specification
Deep navy background, electric blue primary accent, orange reward accent, white text, soft gray cards.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 2: Typography
Readable sans-serif with large word titles and compact body text.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Typography
Specification
Readable sans-serif with large word titles and compact body text.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 3: Navigation
Bottom tabs for Home, Scan, Practice, Progress/Profile. Scan should be central or primary.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Navigation
Specification
Bottom tabs for Home, Scan, Practice, Progress/Profile. Scan should be central or primary.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 4: Buttons
Primary buttons in blue, reward/secondary in orange, disabled states clearly visible.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Buttons
Specification
Primary buttons in blue, reward/secondary in orange, disabled states clearly visible.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 5: Cards
Rounded cards with clear hierarchy, used for daily missions, word cards, pack cards, and progress.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Cards
Specification
Rounded cards with clear hierarchy, used for daily missions, word cards, pack cards, and progress.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 6: Word Card
Large word, part of speech, short definition, pronunciation icon, progress status.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Word Card
Specification
Large word, part of speech, short definition, pronunciation icon, progress status.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 7: Scanner Frame
High-contrast camera overlay with square scan target and helpful copy.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Scanner Frame
Specification
High-contrast camera overlay with square scan target and helpful copy.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 8: Reward Modal
Badge icon, short celebratory title, XP amount, one dismiss action.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Reward Modal
Specification
Badge icon, short celebratory title, XP amount, one dismiss action.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 9: Empty States
Friendly explanation plus one clear action.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Empty States
Specification
Friendly explanation plus one clear action.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 10: Loading States
Skeletons for lists and cards, spinner only for short operations.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Loading States
Specification
Skeletons for lists and cards, spinner only for short operations.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 11: Error States
Human language, retry action, support option if needed.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Error States
Specification
Human language, retry action, support option if needed.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 12: Accessibility
Support dynamic text where possible, strong contrast, labels for icons, touch targets >=44px.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Accessibility
Specification
Support dynamic text where possible, strong contrast, labels for icons, touch targets >=44px.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 13: Iconography
Line icons for book, speaker, calendar, trophy, globe, light bulb, star, scan.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Iconography
Specification
Line icons for book, speaker, calendar, trophy, globe, light bulb, star, scan.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 14: Motion
Subtle scan success, XP count-up, badge unlock, card transitions. Avoid excessive animation.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Motion
Specification
Subtle scan success, XP count-up, badge unlock, card transitions. Avoid excessive animation.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

Design System 15: Dark Mode
Primary design is already dark; light mode can be added later if needed.
Use shared reusable components. The product should feel consistent from scanner to parent dashboard to admin. Avoid one-off CSS or hardcoded colors in screens.
• Define tokens for colors, spacing, radius, font sizes, shadows, and z-index.
• Use components for buttons, cards, modals, forms, tabs, and stat chips.
• Document states: default, hover/pressed, disabled, loading, error, success.
Area
Specification
Component/Token
Dark Mode
Specification
Primary design is already dark; light mode can be added later if needed.
Acceptance Criteria
Implemented through shared design tokens and reusable components.

AI Roadmap 1: Explain Like I Am 8
Simple child-friendly explanation of a word.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
Explain Like I Am 8
Purpose
Simple child-friendly explanation of a word.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 2: Explain Like I Am 12
Middle school explanation with clearer nuance.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
Explain Like I Am 12
Purpose
Middle school explanation with clearer nuance.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 3: Explain Like I Am 18
More advanced academic explanation.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
Explain Like I Am 18
Purpose
More advanced academic explanation.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 4: Explain for School
Academic use and classroom-friendly example.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
Explain for School
Purpose
Academic use and classroom-friendly example.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 5: Explain for Business
Professional context for adult learners.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
Explain for Business
Purpose
Professional context for adult learners.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 6: Memory Trick Generator
AI creates a mnemonic to help remember the word.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
Memory Trick Generator
Purpose
AI creates a mnemonic to help remember the word.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 7: Personalized Examples
Examples based on age, interests, and learning goal.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
Personalized Examples
Purpose
Examples based on age, interests, and learning goal.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 8: AI Quiz Generator
Creates distractors and practice questions.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
AI Quiz Generator
Purpose
Creates distractors and practice questions.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 9: AI Story Mode
Uses mastered words in short stories and dialogues.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
AI Story Mode
Purpose
Uses mastered words in short stories and dialogues.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 10: AI Coach
Recommends what to review and which tile to wear next.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
AI Coach
Purpose
Recommends what to review and which tile to wear next.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 11: Scan Anything
Future camera/text extraction to add words from books, menus, and homework.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
Scan Anything
Purpose
Future camera/text extraction to add words from books, menus, and homework.
MVP Status
Architect for later; do not require for launch unless simple and safe.

AI Roadmap 12: AI Conversation Partner
Future language practice with voice, pronunciation correction, and feedback.
Do not block the MVP on AI. However, the database and service structure should allow AI explanations, AI-generated activities, and personalization to be added without rebuilding the app. For child users, AI content must be bounded, moderated, and age-appropriate.
• AI outputs must be reviewable or constrained for child safety.
• Cache generated content to control cost.
• Track source prompts and model version.
• Allow admin override of generated text.
Area
Specification
Feature
AI Conversation Partner
Purpose
Future language practice with voice, pronunciation correction, and feedback.
MVP Status
Architect for later; do not require for launch unless simple and safe.

Execution Section 1: Parent Dashboard Requirements
Parents need confidence, not complexity.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Weekly summary
• Words learned
• Words mastered
• Streak
• Recent badges
• Suggested encouragement
• Multiple child profiles
Area
Specification
Area
Parent Dashboard Requirements
Build Standard
Parents need confidence, not complexity.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 2: Admin Dashboard Requirements
Admin tools are required because physical tiles must map correctly to digital content.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Word CRUD
• Pack CRUD
• Tile code assignment
• Batch export
• Publish workflow
• Content QA
• User support
• Analytics
Area
Specification
Area
Admin Dashboard Requirements
Build Standard
Admin tools are required because physical tiles must map correctly to digital content.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 3: Security Requirements
Protect children, accounts, and content integrity.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Authentication required
• Role-based access
• Row-level security
• No public child data
• Audit admin changes
• Secure file storage
• Rate limit scans
Area
Specification
Area
Security Requirements
Build Standard
Protect children, accounts, and content integrity.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 4: Privacy Requirements
Design with child and family privacy in mind.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Minimal data collection
• Clear consent
• Parent controls
• Delete/export account path
• No public leaderboards in MVP
• No unnecessary location collection
Area
Specification
Area
Privacy Requirements
Build Standard
Design with child and family privacy in mind.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 5: Analytics Requirements
Measure the learning loop.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Activation: first scan
• Engagement: daily active learner
• Retention: 7-day streak
• Content: word completion
• Funnel: scan to practice
• Errors: invalid codes
• Revenue later: pack purchase
Area
Specification
Area
Analytics Requirements
Build Standard
Measure the learning loop.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 6: Notification Requirements
Reminders should support habit, not spam.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Daily word reminder
• Streak reminder
• Parent weekly summary
• Mission reminder
• Notification settings
• Respect OS permission
Area
Specification
Area
Notification Requirements
Build Standard
Reminders should support habit, not spam.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 7: Testing Requirements
The app must be tested like a real product.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Unit tests for services
• Integration tests for scan flow
• E2E onboarding test
• Admin CRUD test
• Permission error tests
• Offline/slow network tests
Area
Specification
Area
Testing Requirements
Build Standard
The app must be tested like a real product.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 8: Deployment Requirements
Use repeatable environments.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Dev/staging/prod
• Seed data
• CI/CD
• Crash reporting
• Environment variables
• Migration scripts
• Rollback plan
Area
Specification
Area
Deployment Requirements
Build Standard
Use repeatable environments.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 9: Launch Plan
Start with a controlled beta before public launch.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Internal alpha
• Family beta
• Small school/tutor pilot
• Feedback survey
• Bug fix sprint
• Content expansion
• Public MVP launch
Area
Specification
Area
Launch Plan
Build Standard
Start with a controlled beta before public launch.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 10: Recommended Tech Stack
Choose tools optimized for speed and maintainability.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• React Native Expo TypeScript
• Supabase or Firebase
• Next.js admin dashboard
• Postgres if Supabase
• Storage for audio/images
• Push notifications via Expo/Firebase
• Analytics via PostHog/Firebase
Area
Specification
Area
Recommended Tech Stack
Build Standard
Choose tools optimized for speed and maintainability.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 11: File Structure
Keep code modular for AI and human developers.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• /app or /src
• /components
• /features/scanner
• /features/words
• /features/practice
• /features/progress
• /features/parent
• /features/admin
• /services
• /types
• /lib
• /tests
Area
Specification
Area
File Structure
Build Standard
Keep code modular for AI and human developers.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 12: Coding Standards
Make future AI work safer.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• TypeScript strict
• No hardcoded secrets
• Shared constants
• Service layer
• Reusable components
• Comments for complex logic
• Clear naming
• Tests for critical flows
Area
Specification
Area
Coding Standards
Build Standard
Make future AI work safer.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 13: Accessibility Standard
The app must work for kids, parents, and diverse learners.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Large tap targets
• Readable contrast
• Screen reader labels
• Captions/transcripts for audio where possible
• Simple copy
• No color-only status
• Keyboard support for web admin
Area
Specification
Area
Accessibility Standard
Build Standard
The app must work for kids, parents, and diverse learners.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 14: Monetization Architecture
Do not build paywall first, but prepare for revenue.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Bracelet sales
• Tile pack sales
• Premium app
• Premium packs
• Parent premium
• School licenses
• Teacher marketplace later
• Corporate learning later
Area
Specification
Area
Monetization Architecture
Build Standard
Do not build paywall first, but prepare for revenue.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 15: Future School Platform
Architect now, build later.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Teacher dashboard
• Assignments
• Class progress
• Classroom leaderboards
• Vocabulary tournaments
• School challenges
• District reporting
• Marketplace
Area
Specification
Area
Future School Platform
Build Standard
Architect now, build later.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 16: Future Marketplace
Support creator and LexLoo-made packs later.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Premium packs
• Teacher-created packs
• Language packs
• SAT packs
• Career packs
• Revenue sharing
• Content review workflow
Area
Specification
Area
Future Marketplace
Build Standard
Support creator and LexLoo-made packs later.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 17: Future Looz Digital Ecosystem
Connect physical charms with digital rewards later.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Digital Looz characters
• Progression
• Accessories
• XP upgrades
• Seasonal Looz
• Reward store
• Physical/digital collection
Area
Specification
Area
Future Looz Digital Ecosystem
Build Standard
Connect physical charms with digital rewards later.
Acceptance
Implemented, tested, and documented before launch.

Execution Section 18: LexLoo Constitution
Permanent rules for every builder.
This section defines build requirements that apply across the app. Any engineering or AI coding agent should treat these as implementation rules, not optional suggestions.
• Preserve physical-digital connection
• Do not remove learning loop
• Do not hardcode content
• Build modularly
• Protect children
• Make learning fast
• Make progress visible
• Document assumptions
Area
Specification
Area
LexLoo Constitution
Build Standard
Permanent rules for every builder.
Acceptance
Implemented, tested, and documented before launch.

Master AI Build Prompt Part 1
Copy this into Cursor, Codex, Claude Code, Windsurf, Lovable, Bolt, or Replit Agent when building the app.

You are the CTO, senior product manager, UX designer, database architect, and lead full-stack engineer for LexLoo. Build the LexLoo mobile app MVP exactly from this PRD. Assume no prior knowledge. LexLoo is a wearable learning platform where users wear physical word tiles on a bracelet, scan each tile, learn vocabulary or language content, practice through games, build streaks, earn XP, unlock badges, and track mastery. The MVP must prove the Wear & Learn loop: scan a tile, open the word, learn it, practice it, earn progress, and return daily.

Use React Native with Expo and TypeScript for the mobile app unless instructed otherwise. Use Supabase or Firebase for authentication, database, storage, and server functions. Build a web admin dashboard, preferably Next.js, for managing words, packs, tile codes, users, and analytics. The mobile app must include onboarding, login, student profile, learning goal selection, notification setup, home dashboard, scanner, manual code entry, word detail, pronunciation, translations, examples, flashcards, multiple-choice quiz, spelling challenge, saved words, progress dashboard, XP, streaks, badges, profile, settings, parent dashboard, and support states. The admin dashboard must support CRUD for words, packs, tile codes, batch exports, publishing, and content QA.

Do not build unnecessary future features before the MVP is stable. Do not add social feeds, global leaderboards, marketplace payments, AI conversations, or teacher marketplace unless the core scan-learn-master loop is complete. However, structure the database so these future features can be added later. Never hardcode word content in UI. Use seed data and admin-created content. Every important user action must save to the database and emit an analytics event. Every screen must have loading, empty, and error states. Every feature must be child-safe and parent-friendly.

Part 1 emphasis: implement the system incrementally. Build foundation first, then scanner, then word detail, then practice, then progress, then parent/admin. After each step, run tests and verify the user flow end-to-end.
• Never invent a different product.
• Never skip the admin dashboard.
• Never make tile scanning a fake demo.
• Never store child progress only locally.
• Never remove the physical-digital learning connection.
Area
Specification
Build Order
Auth -> schema -> seed data -> onboarding -> scanner -> word detail -> practice -> progress -> gamification -> parent -> admin -> analytics -> polish.
Quality Bar
Production-ready MVP, not a disposable prototype.

Master AI Build Prompt Part 2
Copy this into Cursor, Codex, Claude Code, Windsurf, Lovable, Bolt, or Replit Agent when building the app.

You are the CTO, senior product manager, UX designer, database architect, and lead full-stack engineer for LexLoo. Build the LexLoo mobile app MVP exactly from this PRD. Assume no prior knowledge. LexLoo is a wearable learning platform where users wear physical word tiles on a bracelet, scan each tile, learn vocabulary or language content, practice through games, build streaks, earn XP, unlock badges, and track mastery. The MVP must prove the Wear & Learn loop: scan a tile, open the word, learn it, practice it, earn progress, and return daily.

Use React Native with Expo and TypeScript for the mobile app unless instructed otherwise. Use Supabase or Firebase for authentication, database, storage, and server functions. Build a web admin dashboard, preferably Next.js, for managing words, packs, tile codes, users, and analytics. The mobile app must include onboarding, login, student profile, learning goal selection, notification setup, home dashboard, scanner, manual code entry, word detail, pronunciation, translations, examples, flashcards, multiple-choice quiz, spelling challenge, saved words, progress dashboard, XP, streaks, badges, profile, settings, parent dashboard, and support states. The admin dashboard must support CRUD for words, packs, tile codes, batch exports, publishing, and content QA.

Do not build unnecessary future features before the MVP is stable. Do not add social feeds, global leaderboards, marketplace payments, AI conversations, or teacher marketplace unless the core scan-learn-master loop is complete. However, structure the database so these future features can be added later. Never hardcode word content in UI. Use seed data and admin-created content. Every important user action must save to the database and emit an analytics event. Every screen must have loading, empty, and error states. Every feature must be child-safe and parent-friendly.

Part 2 emphasis: implement the system incrementally. Build foundation first, then scanner, then word detail, then practice, then progress, then parent/admin. After each step, run tests and verify the user flow end-to-end.
• Never invent a different product.
• Never skip the admin dashboard.
• Never make tile scanning a fake demo.
• Never store child progress only locally.
• Never remove the physical-digital learning connection.
Area
Specification
Build Order
Auth -> schema -> seed data -> onboarding -> scanner -> word detail -> practice -> progress -> gamification -> parent -> admin -> analytics -> polish.
Quality Bar
Production-ready MVP, not a disposable prototype.

Master AI Build Prompt Part 3
Copy this into Cursor, Codex, Claude Code, Windsurf, Lovable, Bolt, or Replit Agent when building the app.

You are the CTO, senior product manager, UX designer, database architect, and lead full-stack engineer for LexLoo. Build the LexLoo mobile app MVP exactly from this PRD. Assume no prior knowledge. LexLoo is a wearable learning platform where users wear physical word tiles on a bracelet, scan each tile, learn vocabulary or language content, practice through games, build streaks, earn XP, unlock badges, and track mastery. The MVP must prove the Wear & Learn loop: scan a tile, open the word, learn it, practice it, earn progress, and return daily.

Use React Native with Expo and TypeScript for the mobile app unless instructed otherwise. Use Supabase or Firebase for authentication, database, storage, and server functions. Build a web admin dashboard, preferably Next.js, for managing words, packs, tile codes, users, and analytics. The mobile app must include onboarding, login, student profile, learning goal selection, notification setup, home dashboard, scanner, manual code entry, word detail, pronunciation, translations, examples, flashcards, multiple-choice quiz, spelling challenge, saved words, progress dashboard, XP, streaks, badges, profile, settings, parent dashboard, and support states. The admin dashboard must support CRUD for words, packs, tile codes, batch exports, publishing, and content QA.

Do not build unnecessary future features before the MVP is stable. Do not add social feeds, global leaderboards, marketplace payments, AI conversations, or teacher marketplace unless the core scan-learn-master loop is complete. However, structure the database so these future features can be added later. Never hardcode word content in UI. Use seed data and admin-created content. Every important user action must save to the database and emit an analytics event. Every screen must have loading, empty, and error states. Every feature must be child-safe and parent-friendly.

Part 3 emphasis: implement the system incrementally. Build foundation first, then scanner, then word detail, then practice, then progress, then parent/admin. After each step, run tests and verify the user flow end-to-end.
• Never invent a different product.
• Never skip the admin dashboard.
• Never make tile scanning a fake demo.
• Never store child progress only locally.
• Never remove the physical-digital learning connection.
Area
Specification
Build Order
Auth -> schema -> seed data -> onboarding -> scanner -> word detail -> practice -> progress -> gamification -> parent -> admin -> analytics -> polish.
Quality Bar
Production-ready MVP, not a disposable prototype.

Master AI Build Prompt Part 4
Copy this into Cursor, Codex, Claude Code, Windsurf, Lovable, Bolt, or Replit Agent when building the app.

You are the CTO, senior product manager, UX designer, database architect, and lead full-stack engineer for LexLoo. Build the LexLoo mobile app MVP exactly from this PRD. Assume no prior knowledge. LexLoo is a wearable learning platform where users wear physical word tiles on a bracelet, scan each tile, learn vocabulary or language content, practice through games, build streaks, earn XP, unlock badges, and track mastery. The MVP must prove the Wear & Learn loop: scan a tile, open the word, learn it, practice it, earn progress, and return daily.

Use React Native with Expo and TypeScript for the mobile app unless instructed otherwise. Use Supabase or Firebase for authentication, database, storage, and server functions. Build a web admin dashboard, preferably Next.js, for managing words, packs, tile codes, users, and analytics. The mobile app must include onboarding, login, student profile, learning goal selection, notification setup, home dashboard, scanner, manual code entry, word detail, pronunciation, translations, examples, flashcards, multiple-choice quiz, spelling challenge, saved words, progress dashboard, XP, streaks, badges, profile, settings, parent dashboard, and support states. The admin dashboard must support CRUD for words, packs, tile codes, batch exports, publishing, and content QA.

Do not build unnecessary future features before the MVP is stable. Do not add social feeds, global leaderboards, marketplace payments, AI conversations, or teacher marketplace unless the core scan-learn-master loop is complete. However, structure the database so these future features can be added later. Never hardcode word content in UI. Use seed data and admin-created content. Every important user action must save to the database and emit an analytics event. Every screen must have loading, empty, and error states. Every feature must be child-safe and parent-friendly.

Part 4 emphasis: implement the system incrementally. Build foundation first, then scanner, then word detail, then practice, then progress, then parent/admin. After each step, run tests and verify the user flow end-to-end.
• Never invent a different product.
• Never skip the admin dashboard.
• Never make tile scanning a fake demo.
• Never store child progress only locally.
• Never remove the physical-digital learning connection.
Area
Specification
Build Order
Auth -> schema -> seed data -> onboarding -> scanner -> word detail -> practice -> progress -> gamification -> parent -> admin -> analytics -> polish.
Quality Bar
Production-ready MVP, not a disposable prototype.

Master AI Build Prompt Part 5
Copy this into Cursor, Codex, Claude Code, Windsurf, Lovable, Bolt, or Replit Agent when building the app.

You are the CTO, senior product manager, UX designer, database architect, and lead full-stack engineer for LexLoo. Build the LexLoo mobile app MVP exactly from this PRD. Assume no prior knowledge. LexLoo is a wearable learning platform where users wear physical word tiles on a bracelet, scan each tile, learn vocabulary or language content, practice through games, build streaks, earn XP, unlock badges, and track mastery. The MVP must prove the Wear & Learn loop: scan a tile, open the word, learn it, practice it, earn progress, and return daily.

Use React Native with Expo and TypeScript for the mobile app unless instructed otherwise. Use Supabase or Firebase for authentication, database, storage, and server functions. Build a web admin dashboard, preferably Next.js, for managing words, packs, tile codes, users, and analytics. The mobile app must include onboarding, login, student profile, learning goal selection, notification setup, home dashboard, scanner, manual code entry, word detail, pronunciation, translations, examples, flashcards, multiple-choice quiz, spelling challenge, saved words, progress dashboard, XP, streaks, badges, profile, settings, parent dashboard, and support states. The admin dashboard must support CRUD for words, packs, tile codes, batch exports, publishing, and content QA.

Do not build unnecessary future features before the MVP is stable. Do not add social feeds, global leaderboards, marketplace payments, AI conversations, or teacher marketplace unless the core scan-learn-master loop is complete. However, structure the database so these future features can be added later. Never hardcode word content in UI. Use seed data and admin-created content. Every important user action must save to the database and emit an analytics event. Every screen must have loading, empty, and error states. Every feature must be child-safe and parent-friendly.

Part 5 emphasis: implement the system incrementally. Build foundation first, then scanner, then word detail, then practice, then progress, then parent/admin. After each step, run tests and verify the user flow end-to-end.
• Never invent a different product.
• Never skip the admin dashboard.
• Never make tile scanning a fake demo.
• Never store child progress only locally.
• Never remove the physical-digital learning connection.
Area
Specification
Build Order
Auth -> schema -> seed data -> onboarding -> scanner -> word detail -> practice -> progress -> gamification -> parent -> admin -> analytics -> polish.
Quality Bar
Production-ready MVP, not a disposable prototype.

Master AI Build Prompt Part 6
Copy this into Cursor, Codex, Claude Code, Windsurf, Lovable, Bolt, or Replit Agent when building the app.

You are the CTO, senior product manager, UX designer, database architect, and lead full-stack engineer for LexLoo. Build the LexLoo mobile app MVP exactly from this PRD. Assume no prior knowledge. LexLoo is a wearable learning platform where users wear physical word tiles on a bracelet, scan each tile, learn vocabulary or language content, practice through games, build streaks, earn XP, unlock badges, and track mastery. The MVP must prove the Wear & Learn loop: scan a tile, open the word, learn it, practice it, earn progress, and return daily.

Use React Native with Expo and TypeScript for the mobile app unless instructed otherwise. Use Supabase or Firebase for authentication, database, storage, and server functions. Build a web admin dashboard, preferably Next.js, for managing words, packs, tile codes, users, and analytics. The mobile app must include onboarding, login, student profile, learning goal selection, notification setup, home dashboard, scanner, manual code entry, word detail, pronunciation, translations, examples, flashcards, multiple-choice quiz, spelling challenge, saved words, progress dashboard, XP, streaks, badges, profile, settings, parent dashboard, and support states. The admin dashboard must support CRUD for words, packs, tile codes, batch exports, publishing, and content QA.

Do not build unnecessary future features before the MVP is stable. Do not add social feeds, global leaderboards, marketplace payments, AI conversations, or teacher marketplace unless the core scan-learn-master loop is complete. However, structure the database so these future features can be added later. Never hardcode word content in UI. Use seed data and admin-created content. Every important user action must save to the database and emit an analytics event. Every screen must have loading, empty, and error states. Every feature must be child-safe and parent-friendly.

Part 6 emphasis: implement the system incrementally. Build foundation first, then scanner, then word detail, then practice, then progress, then parent/admin. After each step, run tests and verify the user flow end-to-end.
• Never invent a different product.
• Never skip the admin dashboard.
• Never make tile scanning a fake demo.
• Never store child progress only locally.
• Never remove the physical-digital learning connection.
Area
Specification
Build Order
Auth -> schema -> seed data -> onboarding -> scanner -> word detail -> practice -> progress -> gamification -> parent -> admin -> analytics -> polish.
Quality Bar
Production-ready MVP, not a disposable prototype.

Master AI Build Prompt Part 7
Copy this into Cursor, Codex, Claude Code, Windsurf, Lovable, Bolt, or Replit Agent when building the app.

You are the CTO, senior product manager, UX designer, database architect, and lead full-stack engineer for LexLoo. Build the LexLoo mobile app MVP exactly from this PRD. Assume no prior knowledge. LexLoo is a wearable learning platform where users wear physical word tiles on a bracelet, scan each tile, learn vocabulary or language content, practice through games, build streaks, earn XP, unlock badges, and track mastery. The MVP must prove the Wear & Learn loop: scan a tile, open the word, learn it, practice it, earn progress, and return daily.

Use React Native with Expo and TypeScript for the mobile app unless instructed otherwise. Use Supabase or Firebase for authentication, database, storage, and server functions. Build a web admin dashboard, preferably Next.js, for managing words, packs, tile codes, users, and analytics. The mobile app must include onboarding, login, student profile, learning goal selection, notification setup, home dashboard, scanner, manual code entry, word detail, pronunciation, translations, examples, flashcards, multiple-choice quiz, spelling challenge, saved words, progress dashboard, XP, streaks, badges, profile, settings, parent dashboard, and support states. The admin dashboard must support CRUD for words, packs, tile codes, batch exports, publishing, and content QA.

Do not build unnecessary future features before the MVP is stable. Do not add social feeds, global leaderboards, marketplace payments, AI conversations, or teacher marketplace unless the core scan-learn-master loop is complete. However, structure the database so these future features can be added later. Never hardcode word content in UI. Use seed data and admin-created content. Every important user action must save to the database and emit an analytics event. Every screen must have loading, empty, and error states. Every feature must be child-safe and parent-friendly.

Part 7 emphasis: implement the system incrementally. Build foundation first, then scanner, then word detail, then practice, then progress, then parent/admin. After each step, run tests and verify the user flow end-to-end.
• Never invent a different product.
• Never skip the admin dashboard.
• Never make tile scanning a fake demo.
• Never store child progress only locally.
• Never remove the physical-digital learning connection.
Area
Specification
Build Order
Auth -> schema -> seed data -> onboarding -> scanner -> word detail -> practice -> progress -> gamification -> parent -> admin -> analytics -> polish.
Quality Bar
Production-ready MVP, not a disposable prototype.

Implementation 1: Sprint 0: Foundation
Repo setup, TypeScript, navigation, auth, backend project, migrations, seed data.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Repo setup, TypeScript, navigation, auth, backend project, migrations, seed data.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 2: Sprint 1: Onboarding
Welcome, signup, login, role, age/grade, goals, reminders, terms/privacy.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Welcome, signup, login, role, age/grade, goals, reminders, terms/privacy.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 3: Sprint 2: Scanner
Camera permission, QR scan, manual code, tile resolution, scan events.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Camera permission, QR scan, manual code, tile resolution, scan events.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 4: Sprint 3: Word Detail
Word display, pronunciation, definition, translations, examples, save, learned.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Word display, pronunciation, definition, translations, examples, save, learned.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 5: Sprint 4: Practice
Flashcards, multiple choice, spelling, matching, results, attempts.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Flashcards, multiple choice, spelling, matching, results, attempts.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 6: Sprint 5: Progress
XP, streaks, learned/mastered states, saved words, profile stats.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
XP, streaks, learned/mastered states, saved words, profile stats.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 7: Sprint 6: Gamification
Badges, levels, daily missions, reward modals.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Badges, levels, daily missions, reward modals.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 8: Sprint 7: Parent
Parent dashboard, child profile, weekly report, multi-child support.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Parent dashboard, child profile, weekly report, multi-child support.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 9: Sprint 8: Admin
Word, pack, tile, user, analytics tools.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Word, pack, tile, user, analytics tools.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 10: Sprint 9: Analytics & Notifications
Events, dashboards, push reminders, weekly summaries.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Events, dashboards, push reminders, weekly summaries.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Implementation 11: Sprint 10: Polish
Accessibility, performance, error states, copy, QA, release prep.
This sprint should produce a demonstrable increment that can be tested by a real user or admin. Do not move to later polish before the core flow is working with real data.
• Create tasks and acceptance criteria.
• Write or update tests.
• Use real seed records.
• Demo on device.
• Log issues and assumptions.
Area
Specification
Sprint Goal
Accessibility, performance, error states, copy, QA, release prep.
Demo Requirement
A user or admin can perform the sprint’s main action without developer help.
Exit Criteria
Code merged, tested, documented, and deployable.

Appendix 1: Sample English Words
Discipline, Resilient, Integrity, Empathy, Persevere, Ambitious, Determination, Accountable, Courageous, Tenacious.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample English Words
Details
Discipline, Resilient, Integrity, Empathy, Persevere, Ambitious, Determination, Accountable, Courageous, Tenacious.

Appendix 2: Sample Spanish Words
Amigo, Familia, Feliz, Casa, Corazon, Gracias, Facil, Medio, Avanzado, Libro.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Spanish Words
Details
Amigo, Familia, Feliz, Casa, Corazon, Gracias, Facil, Medio, Avanzado, Libro.

Appendix 3: Sample SAT Words
Ephemeral, Ubiquitous, Pragmatic, Meticulous, Ambivalent, Altruistic, Synthesize, Analyze, Evaluate, Eloquent.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample SAT Words
Details
Ephemeral, Ubiquitous, Pragmatic, Meticulous, Ambivalent, Altruistic, Synthesize, Analyze, Evaluate, Eloquent.

Appendix 4: Sample Hebrew Pack Direction
Support Hebrew as a language pack with correct right-to-left considerations when Hebrew UI/content is introduced.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Hebrew Pack Direction
Details
Support Hebrew as a language pack with correct right-to-left considerations when Hebrew UI/content is introduced.

Appendix 5: Sample Badges
First Scan, 7-Day Streak, 50 Words Learned, 100 Words Mastered, Quiz Champion, Word Collector.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Badges
Details
First Scan, 7-Day Streak, 50 Words Learned, 100 Words Mastered, Quiz Champion, Word Collector.

Appendix 6: Sample Missions
Scan 1 tile, learn 3 words, complete 1 quiz, review 2 saved words, wear today’s word.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Missions
Details
Scan 1 tile, learn 3 words, complete 1 quiz, review 2 saved words, wear today’s word.

Appendix 7: Sample Admin QA Rules
No published word may be missing definition, language, pack association, or tile mapping when required.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Admin QA Rules
Details
No published word may be missing definition, language, pack association, or tile mapping when required.

Appendix 8: Sample Analytics Events
app_open, onboarding_complete, scan_success, scan_error, word_view, audio_play, quiz_complete, badge_earned.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Analytics Events
Details
app_open, onboarding_complete, scan_success, scan_error, word_view, audio_play, quiz_complete, badge_earned.

Appendix 9: Sample Error Messages
We could not read that tile. Try again or enter the code manually.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Error Messages
Details
We could not read that tile. Try again or enter the code manually.

Appendix 10: Sample Notification Copy
Your LexLoo word is waiting. Wear it, scan it, master it.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Notification Copy
Details
Your LexLoo word is waiting. Wear it, scan it, master it.

Appendix 11: Sample Parent Report Copy
This week, Yonathan learned 12 words, mastered 4, and kept a 5-day streak.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Parent Report Copy
Details
This week, Yonathan learned 12 words, mastered 4, and kept a 5-day streak.

Appendix 12: Sample Tile QR Payload
lexloo://tile/{tile_code} or https://lexloo.com/t/{tile_code}.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Tile QR Payload
Details
lexloo://tile/{tile_code} or https://lexloo.com/t/{tile_code}.

Appendix 13: Sample Pack SKU Model
LEX-ENG-G7-001, LEX-SAT-ADV-001, LEX-SPA-BEG-001, LEX-HEB-BEG-001.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Pack SKU Model
Details
LEX-ENG-G7-001, LEX-SAT-ADV-001, LEX-SPA-BEG-001, LEX-HEB-BEG-001.

Appendix 14: Sample Future Career Pack
Real Estate Vocabulary, Finance Vocabulary, Law Vocabulary, Medicine Vocabulary.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Sample Future Career Pack
Details
Real Estate Vocabulary, Finance Vocabulary, Law Vocabulary, Medicine Vocabulary.

Appendix 15: Final Build Checklist
The app is ready when scanning, learning, practicing, progress, parent view, admin management, analytics, and release QA all pass.
Use these samples to seed the first MVP and validate that the app behaves correctly before connecting full production content. These examples should be editable through the admin dashboard, not hardcoded in the app.
• Create seed data.
• Verify mobile rendering.
• Verify admin editing.
• Verify progress tracking.
• Verify analytics event after use.
Area
Specification
Sample
Final Build Checklist
Details
The app is ready when scanning, learning, practicing, progress, parent view, admin management, analytics, and release QA all pass.

Final Instruction to Builder
Build the app first. The purpose of this document is to prevent the MVP from becoming vague, fake, or scattered. The product is simple at the surface: wear a word, scan it, learn it, practice it, master it. The system underneath must be built correctly so LexLoo can grow into a full learning platform.
• Start with the data model and seed content.
• Build the scanner and word detail flow as the first real demo.
• Add practice and progress immediately after.
• Add parent and admin before public beta.
• Use this PRD as the single source of truth.
