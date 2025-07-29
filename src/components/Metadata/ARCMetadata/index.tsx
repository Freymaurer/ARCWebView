import { ARC } from '@nfdi4plants/arctrl'
import {Stack, Text, Heading } from '@primer/react'
import { MetadataField, PersonsField, PublicationsField } from '../MetadataHelper'

interface ARCMetadataProps {
  arc: ARC;
}

export default function ARCMetadata({arc}: ARCMetadataProps) {

  console.log(arc)

  return (
    <Stack spacing={2}>
      <Heading as='h2'>{arc.Identifier}</Heading>

      <MetadataField label="Title" exists={!!arc.Title}>
        <Text>{arc.Title}</Text>
      </MetadataField>

      <MetadataField label="Description" exists={!!arc.Description}>
        <Text>{arc.Description}</Text>
      </MetadataField>

      <MetadataField label="Submission Date" exists={!!arc.SubmissionDate}>
        <Text>{arc.SubmissionDate}</Text>
      </MetadataField>

      <MetadataField label="Publications" exists={arc.Publications.length > 0}>
        <PublicationsField publications={arc.Publications} />
      </MetadataField>

      <MetadataField label="Contacts" exists={arc.Contacts.length > 0}>
        <PersonsField persons={arc.Contacts} />
      </MetadataField>

      {/* <Heading as='h2'>{study.Identifier}</Heading>
      <MetadataField label="Title" exists={!!study.Title}>
        <Text>{study.Title}</Text>
      </MetadataField>
      <MetadataField label="Description" exists={!!study.Description}>
        <Text>{study.Description}</Text>
      </MetadataField>

      <MetadataField label="Submission Date" exists={!!study.SubmissionDate}>
        <Text>{study.SubmissionDate}</Text>
      </MetadataField>


      <MetadataField label="Study Design Descriptors" exists={study.StudyDesignDescriptors.length > 0}>
        <Stack>
          {study.StudyDesignDescriptors.map((descriptor, index) => (
            <Text key={index}>- {descriptor.NameText}</Text>
          ))}
        </Stack>
      </MetadataField>

      <MetadataField label="Contacts" exists={study.Contacts.length > 0}>
        <PersonsField persons={study.Contacts} />
      </MetadataField> */}
    </Stack>
  )
}