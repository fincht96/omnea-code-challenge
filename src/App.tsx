import {
  Button,
  Container,
  Stack,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import AddNoteForm from './components/AddNoteForm';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import NoteContainer from './components/NoteContainer';

interface Note {
  id: string;
  text: string;
  key?: number;
}

const GET_NOTES = gql`
  query GetNotes(
    $limit: Int! = 10
    $offset: Int! = 0
    $order_by: [notes_order_by!] = { id: desc }
  ) {
    notes(limit: $limit, order_by: $order_by, offset: $offset) {
      id
      text
    }
  }
`;

const INSERT_NOTE = gql`
  mutation InsertNote($text: String!) {
    insert_notes(
      objects: { text: $text }
      on_conflict: { constraint: notes_pkey, update_columns: text }
    ) {
      returning {
        id
        text
      }
    }
  }
`;

function App() {
  const [notes, setNotes] = useState<Array<Note>>([]);
  const [offset, setOffset] = useState<number>(0);
  const query = useQuery(GET_NOTES, {
    variables: {
      offset,
    },
  });
  const [insertNote, mutation] = useMutation(INSERT_NOTE);

  const onFormSubmit = (note: string) => {
    insertNote({ variables: { text: note } }).then((resp) => {
      const newNote = {
        ...resp.data.insert_notes.returning[0],
        key: Math.round(Math.random() * Date.now()),
      };

      setNotes((current) => [newNote, ...current]);
    });
  };

  useEffect(() => {
    if (!query.loading && !query.error) {
      setNotes((current) => [
        ...current,
        ...query.data.notes.map((note: Note, index: number) => ({
          ...note,
          key: current.length + index,
        })),
      ]);
    }
  }, [query.data, query.error, query.loading]);

  return (
    <>
      {(query.error || mutation.error) && (
        <Alert severity="error">
          An error occurred please refresh page and try again.
        </Alert>
      )}
      <Container sx={{ padding: '5rem 1rem' }} maxWidth={'md'}>
        <Typography variant="h3" mb={'5rem'}>
          My notes app
        </Typography>

        <Box mb={'2rem'}>
          <Typography variant="h4" mb={'2rem'}>
            Add a note
          </Typography>
          <AddNoteForm
            onFormSubmit={(note: string) => onFormSubmit(note)}
            disabled={!!mutation.loading || !!mutation.error}
          />
        </Box>

        <Typography variant="h4" mb={'2rem'}>
          All notes
        </Typography>

        <Stack spacing={'1rem'} mb={'2rem'}>
          {notes.map((note: Note, index: number) => {
            return (
              <Box key={note.key ?? index}>
                <NoteContainer text={note.text} id={note.id} />
              </Box>
            );
          })}
        </Stack>

        <Box display={'flex'} justifyContent={'center'}>
          <Button
            variant="outlined"
            onClick={() => {
              setOffset((current) => current + 10);
            }}
            disabled={!!query.error || query.loading}
          >
            Show more
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default App;
