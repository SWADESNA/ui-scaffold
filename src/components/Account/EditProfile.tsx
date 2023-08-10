import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { errorToString, useClient } from '@vocdoni/chakra-components'
import { Account } from '@vocdoni/sdk'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiTrash } from 'react-icons/bi'
import fallback from '/assets/default-avatar.png'

interface EditFormFields {
  name: string
  description: string
  avatar: string
}

const REGEX_AVATAR = /^(https?:\/\/|ipfs:\/\/)/i

const EditProfile = () => {
  const { account, client, createAccount } = useClient()
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const required = {
    value: true,
    message: t('form.error.field_is_required'),
  }

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: account?.account.name.default || '',
      description: account?.account.description.default || '',
      avatar: account?.account.avatar || '',
    },
  })

  const avatar = watch('avatar')

  const correctAvatarFormat = (val: string) => REGEX_AVATAR.test(val)

  const onSubmit: SubmitHandler<EditFormFields> = async (values: EditFormFields) => {
    setLoading(true)

    try {
      await client.updateAccountInfo(new Account({ ...account?.account, ...values }))
      setLoading(false)
      onClose()
    } catch (err: any) {
      setLoading(false)
      onClose()
      setError(errorToString(err))
      onOpenError()
    }
  }

  return (
    <>
      <Button onClick={onOpen} display='flex' justifyContent='end' variant='dropdown'>
        {t('menu.edit_profile')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={3} minW={{ md: '700px' }}>
          <Box>
            <ModalHeader>{t('menu.edit_profile')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5}>
              <Flex
                as='form'
                direction='column'
                gap={6}
                onSubmit={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleSubmit(onSubmit)(e)
                }}
              >
                <Flex alignItems='center' gap={5}>
                  <Box position='relative' outline='none' border='none'>
                    <AspectRatio
                      flexShrink={0}
                      w={{ base: 20, md: 40 }}
                      ratio={1.25 / 1}
                      borderRadius='lg'
                      overflow='hidden'
                    >
                      <Image src={avatar} fallbackSrc={fallback} />
                    </AspectRatio>
                    {correctAvatarFormat(avatar) && (
                      <IconButton
                        aria-label='trash icon'
                        icon={<BiTrash />}
                        onClick={() => setValue('avatar', '')}
                        position='absolute'
                        top={2}
                        right={2}
                        cursor='pointer'
                        size='xs'
                        fontSize='md'
                      />
                    )}
                  </Box>
                  <FormControl isInvalid={!!errors.avatar}>
                    <Input
                      type='text'
                      {...register('avatar', {
                        validate: (val: string) => {
                          if (val && !correctAvatarFormat(val)) {
                            return t('form.error.avatar_error')
                          }
                        },
                      })}
                      mb={1}
                      placeholder={t('form.edit_profile.avatar_placeholder').toString()}
                    />

                    {!!errors.avatar ? (
                      <FormErrorMessage>{errors.avatar?.message?.toString()}</FormErrorMessage>
                    ) : (
                      <FormHelperText>
                        <InfoOutlineIcon />
                        <Text>{t('form.edit_profile.avatar_helper')}</Text>
                      </FormHelperText>
                    )}
                  </FormControl>
                </Flex>
                <FormControl isInvalid={!!errors.name}>
                  <Input
                    type='text'
                    {...register('name', { required })}
                    mb={1}
                    placeholder={t('form.account_create.title_placeholder').toString()}
                  />
                  {!!errors.name ? (
                    <FormErrorMessage>{errors.name?.message?.toString()}</FormErrorMessage>
                  ) : (
                    <FormHelperText>
                      <InfoOutlineIcon />
                      <Text>{t('form.account_create.title_helper')}</Text>
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl>
                  <Textarea
                    {...register('description')}
                    placeholder={t('form.account_create.description_placeholder').toString()}
                  />
                  <FormHelperText>
                    <InfoOutlineIcon />
                    <Text> {t('form.account_create.description_helper')}</Text>
                  </FormHelperText>
                </FormControl>
                <Button type='submit' colorScheme='primary' disabled={loading} cursor={loading ? 'auto' : 'pointer'}>
                  {loading ? <Spinner /> : t('menu.edit_profile_btn')}
                </Button>
              </Flex>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenError} onClose={onCloseError} closeOnEsc={!!error} closeOnOverlayClick={!!error} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('form.error.edit_profile')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color='red.300'>{error}</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onCloseError} colorScheme='primary'>
              {t('form.process_create.confirm.close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditProfile