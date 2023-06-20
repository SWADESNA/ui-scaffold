import { Flex } from '@chakra-ui/react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import CreateProcessMeta from '../Meta'
import CreateProcessSettings from '../Settings'
import Wrapper from '../Wrapper'
import { StepsNavigation } from './Navigation'
import { useProcessCreationSteps } from './use-steps'

export interface InfoValues {
  title: string
  description: string
  endDate: string
  startDate: string
  electionType: {
    autoStart: boolean
    interruptible: boolean
    secretUntilTheEnd: boolean
  }
  maxVoteOverwrites: number
  weightedVote: boolean
}

export const Info = () => {
  const { form, setForm, next } = useProcessCreationSteps()
  const methods = useForm<InfoValues>({
    defaultValues: form,
  })

  const onSubmit: SubmitHandler<InfoValues> = (data) => {
    setForm({ ...form, ...data })
    next()
  }

  return (
    <FormProvider {...methods}>
      <Wrapper>
        <Flex
          as='form'
          id='process-create-form'
          onSubmit={methods.handleSubmit(onSubmit)}
          flexDirection='column'
          gap={12}
        >
          <CreateProcessMeta />
          <CreateProcessSettings />
        </Flex>
      </Wrapper>

      <StepsNavigation />
    </FormProvider>
  )
}