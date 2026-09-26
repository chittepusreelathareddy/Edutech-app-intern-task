# EduTech LMS - React Native Expo App

A Mini LMS (Learning Management System) built with React Native Expo.

## Tech Stack

- **Framework**: React Native Expo (SDK 56)
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router (file-based routing)
- **Auth Storage**: Expo SecureStore (tokens), AsyncStorage (app data)
- **Forms**: React Hook Form + Zod validation
- **Images**: Expo Image (with caching)
- **Notifications**: Expo Notifications
- **AI**: Google Gemini (course insights & recommendations)
- **Offline**: @react-native-community/netinfo
- **API**: [freeapi.app](https://api.freeapi.app)
- **Server** : one can create backend server too instead of using API

## Features

- **Auth** — Register/Login with JWT, auto-login on restart, secure token storage
- **Course Catalog** — Browse courses from freeapi.app with search & pull-to-refresh
- **AI Insights** — Gemini-generated summaries, learning outcomes, and suitability on course detail
- **Bookmarks** — Save courses locally; notification when 5+ bookmarked
- **Enroll** — Enroll in courses with visual feedback
- **WebView** — Course content viewer with Native ↔ WebView messaging
- **Profile** — View user info and stats
- **Offline Banner** — Detects and displays no-connection state
- **Notifications** — Reminder if app not opened for 24 hours
- **Error Handling** — Retry logic, timeout, user-friendly errors

## Folder Structure

```
app/
  (auth)/      # login & register screens
  (tabs)/      # main tabs: courses, bookmarks, profile
  course/[id]  # course detail screen
  webview      # WebView content screen
components/    # CourseCard, SearchBar, OfflineBanner
constants/     # API endpoints, color palette
hooks/         # useNetworkStatus
providers/     # AuthProvider, CourseProvider
store/         # authStore, courseStore (context + helpers)
utils/         # api client (fetch + retry), notifications, ai (Gemini)
```

## Setup & Run

```bash
# Install dependencies
npm install

# Copy .env.example to .env and set EXPO_PUBLIC_BASE_URL and EXPO_PUBLIC_GEMINI_API_KEY

# Start Expo
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```
## Environment Variables Needed

Create a `.env` file in the project root and add:

```env
EXPO_PUBLIC_BASE_URL="https://api.freeapi.app"
EXPO_PUBLIC_GEMINI_API_KEY="AIzaSyAsHRHl5-h7hvepMPJ-q6ifiIDISgdX-Fg"
```

## API Endpoints Used

| Purpose      | Endpoint                            |
| ------------ | ----------------------------------- |
| Register     | `POST /api/v1/users/register`       |
| Login        | `POST /api/v1/users/login`          |
| Logout       | `POST /api/v1/users/logout`         |
| Current User | `GET /api/v1/users/current-user`    |
| Courses      | `GET /api/v1/public/randomproducts` |
| Instructors  | `GET /api/v1/public/randomusers`    |

## Key Architectural Decisions

- **Expo Router** for file-based navigation — simpler than React Navigation config
- **Context + useReducer** for auth state — avoids external state library overhead
- **SecureStore** for tokens, **AsyncStorage** for bookmarks/enrollments
- **Fetch with retry** — built-in retry (2 attempts) + 10s timeout on every request
- **Memoized components** — `CourseCard` wrapped in `memo`, filtered list in `useMemo`
- **Gemini API** — structured JSON insights generated on the course detail screen


##APK Build Instructions

#for eas build 

# Install dependencies
npm install

#eas login
open terminal

- type `eas login`
- asked for credentials add the below creds
- login name- your login name
- password- your password

# Create Android development build
npx eas build --platform android --profile development

#for local build
npx expo prebuild
cd android
./gradlew assembleDebug

#local build generated apk location
android/app/build/outputs/apk/debug/app-debug.apk


##Known Limitations/Issues

- Gemini AI summary may sometimes fail when the Gemini server is  busy or request limits are reached.
- Profile image update is simulated locally because there is no actual backend server for uploading/updating profile images.
- Updated profile image resets to the default image when the app is reopened.
- Course thumbnail images are fallback/demo images because product/course API image URLs may not always be reliable.
- Profile avatar is also using a fallback image instead of an actual avatar from the API.
 - *Authentication limitation*: Since the app uses FreeAPI as an external demo API, user persistence/session behavior may not always work like a production backend. In some cases after logout, login may show `"User does not exist"`, requiring the user to register again.


## Assignment Submission Notes

### Findings — Limitations, Bugs & UX Issues

| # | Finding | Feasible Solution |
|---|---------|--------------------|
| 1 | **Thumbnail mismatch/flicker (fixed — see below).** `CourseCard` generated a brand-new random image on every render, and the detail screen generated a second, different random image for the same course, so the list and detail views almost never matched and the image changed on every scroll/refresh. | Derive the thumbnail once per course from `course.id`/`course.thumbnail` via a memoized helper, shared by both screens. |
| 2 | **Avatar resets on app restart (fixed — see below).** Documented in the original README; the picked avatar only lived in component state. | Persist the picked URI to AsyncStorage and reload it on mount. |
| 3 | **No pagination on the course catalog.** `fetchCourses(page=1, limit=20)` always requests page 1 with a hardcoded limit, so only the first 20 courses are ever reachable regardless of scrolling, and search only searches within that same 20. | Add `onEndReached` infinite-scroll in the `FlatList`, incrementing `page` and appending results; keep search working against the full loaded set. |
| 4 | **Gemini API key committed in the README.** A live-looking API key is checked into version control history, which is a real credential-leak risk in a public repo. | Remove the key from docs/history, load only from `.env` (already partially done in code), and rotate the key. |
| 5 | **Course content WebView depends on a personal third-party GitHub Pages URL** and forwards the user's JWT as a request header to it. If that page goes down, "View Course Content" breaks app-wide; forwarding a live auth token to a static third-party page is also unnecessary exposure. | Host the course-content viewer in an owned domain, and only pass the minimum non-sensitive data needed (drop the `Authorization` header if the page doesn't need authenticated calls). |
| 6 | **`expo-image-picker`'s `MediaTypeOptions` API is deprecated** in favor of `MediaType` on newer SDK lines, which will start throwing warnings/errors on future upgrades. | Swap to the non-deprecated `MediaType.Images` enum. |
| 7 | **Bookmarks tab can appear inconsistent with the catalog** once pagination (finding #3) is added, since it filters bookmarked IDs against only the currently-loaded `courses` array. | Store full bookmarked course objects (not just IDs) so bookmarks remain visible even if that course later falls off the loaded page. |

### Resolved Limitation

**Fixed #1 — thumbnail mismatch/flicker.** Added `utils/thumbnail.ts` with a single `getStableThumbnail()` used by both `CourseCard` and the course detail screen, memoized on `course.id`. It prefers the real `course.thumbnail` from the API when it's a valid URL, and otherwise falls back to a placeholder image *seeded by the course id* (not `Math.random()`), so the same course always shows the same image everywhere and no longer flickers on re-render.

Also fixed the documented **#2 — avatar reset bug** as a bonus: the picked profile photo is now saved to AsyncStorage and restored on launch.

### New Feature — Learning Streak & Achievements

Extends the existing bookmark-notification and profile features into a small gamification layer:

- `utils/streak.ts` tracks daily app opens (local calendar day, not UTC) and computes the current streak, longest streak, and progress to the next milestone (3/7/14/30/60/100 days).
- On app launch (`app/_layout.tsx`), a day is recorded once, and crossing a milestone fires a celebratory local notification via `utils/notifications.ts`.
- `components/StreakCard.tsx` renders a premium-styled card on the Profile tab: a flame icon that changes color as the streak heats up, a progress bar to the next badge, and a row of earned/unearned trophy badges for each milestone.

**Why it's useful:** the app already nudges users back with a generic "haven't opened the app" notification; a visible streak gives a positive, personal reason to return daily instead of a passive reminder, and the badge row gives learners a built-in sense of progress the app didn't have before.

**How it works:** every time the app becomes active, `recordDailyActivity()` compares today's date to the last recorded active date in AsyncStorage — same day is a no-op, exactly one day later increments the streak, any bigger gap resets it to 1 — then persists the new current/longest streak. The Profile screen reads that state (`getStreakState()`) to render the card.

### Setup & Testing

Same as the base setup above (`npm install`, add `.env`, `npx expo start`). To verify the two fixes: open a course, back out, re-open it — the thumbnail is now identical every time. Pick a profile photo, kill and reopen the app — the photo is still there. To see the streak feature, open the app on consecutive days (or manually adjust the device clock) to watch the streak count and badges update.

## App Screenshots

<p align="center">
  <img src="./screenshots/splashscreen.jpeg" width="220"/>
  <img src="./screenshots/login.jpeg" width="220"/>
  <img src="./screenshots/register.jpeg" width="220"/>
</p>

<p align="center">
  <img src="./screenshots/courseslist.jpeg" width="220"/>
  <img src="./screenshots/course-details.jpeg" width="220"/>
  <img src="./screenshots/course-content-webview.jpeg" width="220"/>
</p>

<p align="center">
  <img src="./screenshots/courses-bookmarkscreen.jpeg" width="220"/>
  <img src="./screenshots/offline-banner.jpeg" width="220"/>
  <img src="./screenshots/profile.jpeg" width="220"/>
</p>

<p align="center">
  <img src="./screenshots/notifications.jpeg" width="220"/>
</p>
