import { FaPencilAlt } from 'react-icons/fa';
import { Entry } from './data';
import { useEffect, useState } from 'react';

type Props = {
  onCreate: () => void;
  onEdit: (entry: Entry) => void;
};
export default function EntryList({ onCreate, onEdit }: Props) {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function getEntries() {
      try {
        const res = await fetch('/api/entries');
        if (!res.ok) {
          throw new Error(`Error, failed to fetch ${res.status}`);
        }
        const entries = await res.json();
        setEntries(entries);
        console.log(entries);
      } catch (err: unknown) {
        setError(err);
      }
    }
    getEntries();
  }, []);

  if (error) {
    console.error('Fetch error:', error);
    return (
      <p>Error! {error instanceof Error ? error.message : 'Unknown Error'}</p>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="column-full d-flex justify-between align-center">
          <h1>Entries</h1>
          <h3>
            <button
              type="button"
              className="white-text form-link"
              onClick={onCreate}>
              NEW
            </button>
          </h3>
        </div>
      </div>
      <div className="row">
        <div className="column-full">
          <ul className="entry-ul">
            {entries.map((entry: Entry) => (
              <EntryCard key={entry.entryId} entry={entry} onEdit={onEdit} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

type EntryProps = {
  entry: Entry;
  onEdit: (entry: Entry) => void;
};
function EntryCard({ entry, onEdit }: EntryProps) {
  return (
    <li>
      <div className="row">
        <div className="column-half">
          <img
            className="input-b-radius form-image"
            src={entry.photoUrl}
            alt=""
          />
        </div>
        <div className="column-half">
          <div className="row">
            <div className="column-full d-flex justify-between">
              <h3>{entry.title}</h3>
              <button onClick={() => onEdit(entry)}>
                <FaPencilAlt />
              </button>
            </div>
          </div>
          <p>{entry.notes}</p>
        </div>
      </div>
    </li>
  );
}
