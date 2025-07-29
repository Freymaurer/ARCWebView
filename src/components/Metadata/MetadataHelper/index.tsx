import type { Person, Publication } from "@nfdi4plants/arctrl";
import { Heading, Stack, Text } from "@primer/react";

export function MetadataField ({ exists, label, children, as }: { exists: boolean; label: string; children: React.ReactNode, as?: any }) {
  const Component = as || 'h4';
  return (
    <div>
      <Heading as={Component} variant='small'>{label}</Heading>
      {exists ? children : <Text color='fg.muted'>Not available</Text>}
    </div>
  );
}

function PersonField({ person }: { person: Person }) {
  const fullname = [person.FirstName, person.MidInitials, person.LastName].filter(Boolean).join(" ");
  return (
    <div className="border p-2 rounded-2">
      <Heading as={"h4"}>{fullname}</Heading>

      <MetadataField label="ORCID" exists={!!person.ORCID} as='h5'>
        <Text>{person.ORCID}</Text>
      </MetadataField>

      <MetadataField label="Affiliation" exists={!!person.Affiliation} as='h5'>
        <Text>{person.Affiliation}</Text>
      </MetadataField>

      <MetadataField label="Email" exists={!!person.EMail} as='h5'>
        <Text>{person.EMail}</Text>
      </MetadataField>

      <MetadataField label="Phone" exists={!!person.Phone} as='h5'>
        <Text>{person.Phone}</Text>
      </MetadataField>

      <MetadataField label="Roles" exists={!!person.Roles.length} as='h5'>
        <Stack>
          {person.Roles.map((role, index) => (
            <div key={index}>
              <Text>- {role.NameText}</Text>
            </div>
          ))}
        </Stack>
      </MetadataField>
    </div>
  );
}

export function PersonsField({ persons }: { persons: Person[] }) {

  return (
    <Stack>
      {persons.map((person, index) => (
        <PersonField key={index} person={person} />
      ))}
    </Stack>
  )
}


function PublicationField({ publication }: { publication: Publication }) {
  return (
    <div className="border p-2 rounded-2">
      <Heading as={"h4"}>{publication.Title}</Heading>
      <MetadataField label="Status" exists={!!publication.Status} as='h5'>
        <Text>{publication.Status?.NameText}</Text>
      </MetadataField>
      <MetadataField label="DOI" exists={!!publication.DOI} as='h5'>
        <Text>{publication.DOI}</Text>
      </MetadataField>
      <MetadataField label="PubMed ID" exists={!!publication.PubMedID} as='h5'>
        <Text>{publication.PubMedID}</Text>
      </MetadataField>
      <MetadataField label="Authors" exists={!!publication.Authors} as='h5'>
        <Text>{publication.Authors}</Text>
      </MetadataField>
    </div>
  );
}


export function PublicationsField({ publications }: { publications: Publication[] }) {

  return (
    <Stack>
      {publications.map((pub, index) => (
        <PublicationField key={index} publication={pub} />
      ))}
    </Stack>
  );
}