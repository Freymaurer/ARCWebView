import type { ArcAssay } from '@nfdi4plants/arctrl'
import {Stack, Text, Heading } from '@primer/react'
import { MetadataField, PersonsField } from '../MetadataHelper'

interface AssayMetadataProps {
  assay: ArcAssay;
}

export default function AssayMetadata({assay}: AssayMetadataProps) {

  return (
    <Stack spacing={2}>
      <Heading as='h2'>{assay.Identifier}</Heading>
      <MetadataField label="Title" exists={!!assay.Title}>
        <Text>{assay.Title}</Text>
      </MetadataField>
      <MetadataField label="Description" exists={!!assay.Description}>
        <Text>{assay.Description}</Text>
      </MetadataField>
      <MetadataField label="Measurement Type" exists={!!assay.MeasurementType}>
        <Text>{assay.MeasurementType?.NameText}</Text>
      </MetadataField>
      <MetadataField label="Technology Platform" exists={!!assay.TechnologyPlatform}>
        <Text>{assay.TechnologyPlatform?.NameText}</Text>
      </MetadataField>
      <MetadataField label="Technology Type" exists={!!assay.TechnologyType}>
        <Text>{assay.TechnologyType?.NameText}</Text>
      </MetadataField>

      <MetadataField label="Performers" exists={assay.Performers.length > 0}>
        <PersonsField persons={assay.Performers} />
      </MetadataField>
    </Stack>
  )
}