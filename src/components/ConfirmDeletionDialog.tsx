import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDeletionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recordName: string;
}

const ConfirmDeletionDialog: React.FC<ConfirmDeletionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  recordName,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        {t('Button_DeletePopup_Title')}
      </DialogTitle>
      <DialogContent>
      <Typography>
            {t('Button_DeletePopup_MessageWithName')}
            
              <strong> {recordName ? t(recordName) : recordName}</strong>?
            
          </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #E0E0E0' }}>
        <Button onClick={onClose}  sx={{ color: '#666' }}>
          {t('Button_DeletePopup_Cancel')}
        </Button>
        <Button onClick={onConfirm}  variant="contained"
            color="error"
            sx={{
              bgcolor: '#f44336',
              '&:hover': {
                bgcolor: '#d32f2f',
              },
            }}
            >
          {t('Button_DeletePopup_Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeletionDialog;


