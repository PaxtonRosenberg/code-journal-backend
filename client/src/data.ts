export type UnsavedEntry = {
  title: string;
  notes: string;
  photoUrl: string;
};
export type Entry = UnsavedEntry & {
  entryId: number;
};

let data = {
  entries: [] as Entry[],
  nextEntryId: 1,
};

window.addEventListener('beforeunload', function () {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('code-journal-data', dataJSON);
});

const localData = localStorage.getItem('code-journal-data');
if (localData) {
  data = JSON.parse(localData);
}

export async function readEntries() {
  const res = await fetch('/api/entries');
  if (!res.ok) {
    throw new Error(`Error, failed to fetch ${res.status}`);
  }
  const entries = await res.json();
  return entries;
}

export async function addEntry(entry: UnsavedEntry): Entry {
  const res = await fetch('/api/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  if (!res.ok) {
    throw new Error(`Error, failed to fetch ${res.status}`);
  }
}

export async function updateEntry(entry: Entry): Entry {
  const res = await fetch(`/api/entries/${entry.entryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  if (!res.ok) {
    throw new Error(`Error, failed to fetch ${res.status}`);
  }
  console.log(entry);
  return entry;
}

export async function removeEntry(entryId: number): void {
  const res = await fetch(`/api/entries/${entryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Error, failed to fetch ${res.status}`);
  }
}

// const updatedArray = data.entries.filter(
//   (entry) => entry.entryId !== entryId
// );
// data.entries = updatedArray;
