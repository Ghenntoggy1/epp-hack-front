import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";

interface MfaPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDeny: () => void;
}

const MfaPrompt = ({ isOpen, onClose, onConfirm, onDeny }: MfaPromptProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set Up Multi-Factor Authentication</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Would you like to set up Multi-Factor Authentication (MFA) using your phone?</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onDeny}>No, Don't Set Up MFA</Button>
          <Button colorScheme="blue" onClick={onConfirm}>Yes, Set Up MFA</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MfaPrompt;
