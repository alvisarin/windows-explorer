import { db } from "./connection";
import { folders, files } from "./schema";
import { v4 as uuidv4 } from "uuid";

interface FolderSeed {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
}

interface FileSeed {
  id: string;
  name: string;
  folderId: string;
  size: number;
  mimeType: string;
}

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(files);
  await db.delete(folders);

  // Create folder structure
  const folderData: FolderSeed[] = [];
  const fileData: FileSeed[] = [];

  // Root folders
  const documentsId = uuidv4();
  const picturesId = uuidv4();
  const musicId = uuidv4();
  const videosId = uuidv4();
  const downloadsId = uuidv4();

  folderData.push(
    { id: documentsId, name: "Documents", parentId: null, path: "/Documents" },
    { id: picturesId, name: "Pictures", parentId: null, path: "/Pictures" },
    { id: musicId, name: "Music", parentId: null, path: "/Music" },
    { id: videosId, name: "Videos", parentId: null, path: "/Videos" },
    { id: downloadsId, name: "Downloads", parentId: null, path: "/Downloads" }
  );

  // Documents subfolders
  const workId = uuidv4();
  const personalId = uuidv4();
  const projectsId = uuidv4();

  folderData.push(
    { id: workId, name: "Work", parentId: documentsId, path: "/Documents/Work" },
    { id: personalId, name: "Personal", parentId: documentsId, path: "/Documents/Personal" },
    { id: projectsId, name: "Projects", parentId: documentsId, path: "/Documents/Projects" }
  );

  // Work subfolders (deeper nesting)
  const reportsId = uuidv4();
  const presentationsId = uuidv4();
  const spreadsheetsId = uuidv4();

  folderData.push(
    { id: reportsId, name: "Reports", parentId: workId, path: "/Documents/Work/Reports" },
    { id: presentationsId, name: "Presentations", parentId: workId, path: "/Documents/Work/Presentations" },
    { id: spreadsheetsId, name: "Spreadsheets", parentId: workId, path: "/Documents/Work/Spreadsheets" }
  );

  // Reports subfolders (even deeper)
  const q1ReportsId = uuidv4();
  const q2ReportsId = uuidv4();
  const q3ReportsId = uuidv4();
  const q4ReportsId = uuidv4();

  folderData.push(
    { id: q1ReportsId, name: "Q1 2024", parentId: reportsId, path: "/Documents/Work/Reports/Q1 2024" },
    { id: q2ReportsId, name: "Q2 2024", parentId: reportsId, path: "/Documents/Work/Reports/Q2 2024" },
    { id: q3ReportsId, name: "Q3 2024", parentId: reportsId, path: "/Documents/Work/Reports/Q3 2024" },
    { id: q4ReportsId, name: "Q4 2024", parentId: reportsId, path: "/Documents/Work/Reports/Q4 2024" }
  );

  // Projects subfolders
  const webProjectId = uuidv4();
  const mobileProjectId = uuidv4();
  const apiProjectId = uuidv4();

  folderData.push(
    { id: webProjectId, name: "Web App", parentId: projectsId, path: "/Documents/Projects/Web App" },
    { id: mobileProjectId, name: "Mobile App", parentId: projectsId, path: "/Documents/Projects/Mobile App" },
    { id: apiProjectId, name: "API Server", parentId: projectsId, path: "/Documents/Projects/API Server" }
  );

  // Pictures subfolders
  const vacationId = uuidv4();
  const familyId = uuidv4();
  const screenshotsId = uuidv4();

  folderData.push(
    { id: vacationId, name: "Vacation", parentId: picturesId, path: "/Pictures/Vacation" },
    { id: familyId, name: "Family", parentId: picturesId, path: "/Pictures/Family" },
    { id: screenshotsId, name: "Screenshots", parentId: picturesId, path: "/Pictures/Screenshots" }
  );

  // Vacation subfolders
  const hawaii2023Id = uuidv4();
  const paris2024Id = uuidv4();

  folderData.push(
    { id: hawaii2023Id, name: "Hawaii 2023", parentId: vacationId, path: "/Pictures/Vacation/Hawaii 2023" },
    { id: paris2024Id, name: "Paris 2024", parentId: vacationId, path: "/Pictures/Vacation/Paris 2024" }
  );

  // Music subfolders
  const rockId = uuidv4();
  const jazzId = uuidv4();
  const classicalId = uuidv4();
  const playlistsId = uuidv4();

  folderData.push(
    { id: rockId, name: "Rock", parentId: musicId, path: "/Music/Rock" },
    { id: jazzId, name: "Jazz", parentId: musicId, path: "/Music/Jazz" },
    { id: classicalId, name: "Classical", parentId: musicId, path: "/Music/Classical" },
    { id: playlistsId, name: "Playlists", parentId: musicId, path: "/Music/Playlists" }
  );

  // Videos subfolders
  const moviesId = uuidv4();
  const tutorialsId = uuidv4();
  const recordingsId = uuidv4();

  folderData.push(
    { id: moviesId, name: "Movies", parentId: videosId, path: "/Videos/Movies" },
    { id: tutorialsId, name: "Tutorials", parentId: videosId, path: "/Videos/Tutorials" },
    { id: recordingsId, name: "Recordings", parentId: videosId, path: "/Videos/Recordings" }
  );

  // Add some files
  // Documents files
  fileData.push(
    { id: uuidv4(), name: "resume.pdf", folderId: personalId, size: 245760, mimeType: "application/pdf" },
    { id: uuidv4(), name: "budget.xlsx", folderId: personalId, size: 51200, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { id: uuidv4(), name: "notes.txt", folderId: personalId, size: 2048, mimeType: "text/plain" }
  );

  // Work files
  fileData.push(
    { id: uuidv4(), name: "meeting_notes.docx", folderId: workId, size: 35840, mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { id: uuidv4(), name: "project_plan.pdf", folderId: workId, size: 512000, mimeType: "application/pdf" }
  );

  // Reports files
  fileData.push(
    { id: uuidv4(), name: "Q1_summary.pdf", folderId: q1ReportsId, size: 1048576, mimeType: "application/pdf" },
    { id: uuidv4(), name: "Q1_data.xlsx", folderId: q1ReportsId, size: 256000, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { id: uuidv4(), name: "Q2_summary.pdf", folderId: q2ReportsId, size: 1150976, mimeType: "application/pdf" }
  );

  // Presentations files
  fileData.push(
    { id: uuidv4(), name: "annual_review.pptx", folderId: presentationsId, size: 5242880, mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    { id: uuidv4(), name: "team_update.pptx", folderId: presentationsId, size: 2097152, mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }
  );

  // Project files
  fileData.push(
    { id: uuidv4(), name: "index.html", folderId: webProjectId, size: 4096, mimeType: "text/html" },
    { id: uuidv4(), name: "styles.css", folderId: webProjectId, size: 8192, mimeType: "text/css" },
    { id: uuidv4(), name: "app.js", folderId: webProjectId, size: 16384, mimeType: "application/javascript" },
    { id: uuidv4(), name: "App.tsx", folderId: mobileProjectId, size: 12288, mimeType: "text/typescript" },
    { id: uuidv4(), name: "server.ts", folderId: apiProjectId, size: 20480, mimeType: "text/typescript" }
  );

  // Pictures files
  fileData.push(
    { id: uuidv4(), name: "beach_sunset.jpg", folderId: hawaii2023Id, size: 3145728, mimeType: "image/jpeg" },
    { id: uuidv4(), name: "volcano.jpg", folderId: hawaii2023Id, size: 4194304, mimeType: "image/jpeg" },
    { id: uuidv4(), name: "luau.png", folderId: hawaii2023Id, size: 2621440, mimeType: "image/png" },
    { id: uuidv4(), name: "eiffel_tower.jpg", folderId: paris2024Id, size: 5242880, mimeType: "image/jpeg" },
    { id: uuidv4(), name: "louvre.jpg", folderId: paris2024Id, size: 4718592, mimeType: "image/jpeg" },
    { id: uuidv4(), name: "screenshot_2024.png", folderId: screenshotsId, size: 524288, mimeType: "image/png" }
  );

  // Music files
  fileData.push(
    { id: uuidv4(), name: "rock_anthem.mp3", folderId: rockId, size: 8388608, mimeType: "audio/mpeg" },
    { id: uuidv4(), name: "guitar_solo.mp3", folderId: rockId, size: 6291456, mimeType: "audio/mpeg" },
    { id: uuidv4(), name: "smooth_jazz.mp3", folderId: jazzId, size: 7340032, mimeType: "audio/mpeg" },
    { id: uuidv4(), name: "moonlight_sonata.mp3", folderId: classicalId, size: 15728640, mimeType: "audio/mpeg" }
  );

  // Videos files
  fileData.push(
    { id: uuidv4(), name: "vacation_clip.mp4", folderId: recordingsId, size: 104857600, mimeType: "video/mp4" },
    { id: uuidv4(), name: "tutorial_1.mp4", folderId: tutorialsId, size: 52428800, mimeType: "video/mp4" },
    { id: uuidv4(), name: "tutorial_2.mp4", folderId: tutorialsId, size: 78643200, mimeType: "video/mp4" }
  );

  // Downloads files
  fileData.push(
    { id: uuidv4(), name: "setup.exe", folderId: downloadsId, size: 67108864, mimeType: "application/octet-stream" },
    { id: uuidv4(), name: "archive.zip", folderId: downloadsId, size: 15728640, mimeType: "application/zip" },
    { id: uuidv4(), name: "document.pdf", folderId: downloadsId, size: 1048576, mimeType: "application/pdf" }
  );

  // Insert folders
  for (const folder of folderData) {
    await db.insert(folders).values(folder);
  }

  // Insert files
  for (const file of fileData) {
    await db.insert(files).values(file);
  }

  console.log(`Seeded ${folderData.length} folders and ${fileData.length} files`);
  console.log("Database seeding completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
