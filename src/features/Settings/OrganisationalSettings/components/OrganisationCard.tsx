import { useState, useEffect, useCallback, useRef } from 'react';
import { Form, Button } from 'antd';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { CrPaper } from '@core/core-ui';
import { CrInput } from '@core/core-ui';
import Markdown from '@components/common/Markdown/Markdown';
import { ExclamationCircleOutlined, DeleteFilled } from '@ant-design/icons';
import '../styles.css';
import notificationText from '@features/Settings/texts';
import { useOrganisation } from '../hooks/useOrganisation';
import { useRorSuggestions } from '../hooks/useRorSuggestions';
import type { InviteItem } from '../store/organisationStore';
import { ConfirmationDeleteInviteModal } from './ConfirmationDeleteInviteModal';
import { DropdownInput } from './DropdownInput';
import { useDataProviderStore } from '@/store/dataProviderStore';

const ORGANISATION_CARD_SECTION_ID = 'organisation-card-section';

export const OrganisationCard = () => {
  const {
    organisation,
    inviteCodes,
    isLoadingInvites,
    isInviting,
    isDeleting,
    isUpdating,
    inviteUser,
    deleteInvite,
    updateOrganization,
  } = useOrganisation();

  const { selectedDataProvider } = useDataProviderStore();

  const [organizationName, setOrganizationName] = useState('');
  const [rorId, setRorId] = useState(organisation?.rorId ?? '');
  const [rorName, setRorName] = useState(organisation?.rorName ?? '');
  const [isRorChanged, setRorChanged] = useState(false);
  const [isNameOpen, setNameIsOpen] = useState(false);
  const [isIdOpen, setIdIsOpen] = useState(false);
  const [showAllInvites, setShowAllInvites] = useState(false);
  const [nameFormMessage, setNameFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rorFormMessage, setRorFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedInviteItem, setSelectedInviteItem] = useState<InviteItem | null>(null);
  const [inviteForm] = Form.useForm();
  const [organizationForm] = Form.useForm();

  // Use ROR suggestions hook
  const {
    suggestions: suggestionsId,
    setIsInitialLoad: setIsInitialLoadId,
  } = useRorSuggestions({
    value: rorId,
    isOpen: isIdOpen,
    initialValue: organisation?.rorId,
    skipInitialFetch: true,
    onOpenChange: setIdIsOpen,
  });

  const {
    suggestions: suggestionsName,
    setIsInitialLoad: setIsInitialLoadName,
  } = useRorSuggestions({
    value: rorName,
    isOpen: isNameOpen,
    initialValue: organisation?.rorName,
    skipInitialFetch: true,
    onOpenChange: setNameIsOpen,
  });

  // Initialize organization name from fetched data
  useEffect(() => {
    if (organisation?.name !== undefined) {
      setOrganizationName(organisation.name);
      organizationForm.setFieldsValue({ name: organisation.name });
    }
  }, [organisation, organizationForm]);

  // Initialize ROR values from organisation data
  useEffect(() => {
    if (organisation?.rorId !== undefined) {
      setRorId(organisation.rorId);
      setIsInitialLoadId(true);
    }
    if (organisation?.rorName !== undefined) {
      setRorName(organisation.rorName);
      setIsInitialLoadName(true);
    }
  }, [organisation, setIsInitialLoadId, setIsInitialLoadName]);

  const displayedInviteCodes = showAllInvites ? inviteCodes : inviteCodes.slice(0, 5);

  const handleNameChange = (changedValues: { name?: string }) => {
    if (changedValues.name !== undefined) {
      setOrganizationName(changedValues.name);
      setNameFormMessage(null);
    }
  };

  const handleRorInputChange = useCallback(
    (field: 'id' | 'name') => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (field === 'id') {
        setRorId(value);
        setIsInitialLoadId(false);
        setIdIsOpen(value.length > 0);
      } else {
        setRorName(value);
        setIsInitialLoadName(false);
        setNameIsOpen(value.length > 0);
      }
      setRorFormMessage(null);
    },
    [setIsInitialLoadId, setIsInitialLoadName]
  );

  const handleRorOptionClick = useCallback((field: 'id' | 'name') => () => {
    if (field === 'id') {
      setIdIsOpen(false);
    } else {
      setNameIsOpen(false);
    }
  }, []);

  const handleRorChange = useCallback(() => {
    setRorChanged(
      rorId !== (organisation?.rorId ?? '') ||
      rorName !== (organisation?.rorName ?? '')
    );
    setRorFormMessage(null);
  }, [rorId, rorName, organisation?.rorId, organisation?.rorName]);

  const handleInviteSubmit = useCallback(
    async (values: { email: string }) => {
      const result = await inviteUser(values.email);
      if (result.type === 'success') {
        inviteForm.resetFields();
      }
    },
    [inviteUser, inviteForm]
  );

  const handleOrganizationSubmit = useCallback(
    async (values: { name: string }) => {
      const nameValue = values.name?.trim() || '';
      if (!nameValue || nameValue === organisation?.name) {
        return;
      }

      const result = await updateOrganization({ name: nameValue });

      setNameFormMessage({ type: result.type, text: result.message });

      if (result.type === 'success') {
        setOrganizationName(nameValue);
      }
    },
    [organisation?.name, updateOrganization]
  );

  const handleRorSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const updateData: { ror_id?: string; rorName?: string } = {};
      if (data.ror_id) {
        updateData.ror_id = data.ror_id as string;
      }
      if (data.rorName) {
        updateData.rorName = data.rorName as string;
      }

      if (Object.keys(updateData).length === 0) {
        return;
      }

      const result = await updateOrganization(updateData);

      setRorFormMessage({ type: result.type, text: result.message });

      if (result.type === 'success') {
        setRorChanged(false);
      }
    },
    [updateOrganization]
  );

  const renderRORWarning = useCallback(() => {
    if (
      organisation?.rorId &&
      selectedDataProvider?.rorData?.rorId &&
      organisation.rorId !== selectedDataProvider.rorData.rorId
    ) {
      return (
        <div className="warning-wrapper">
          <ExclamationCircleOutlined />
          <span>
            The ROR ID for your organisation is different from the ROR ID for your repository.
          </span>
        </div>
      );
    }
    return null;
  }, [organisation?.rorId, selectedDataProvider?.rorData?.rorId]);

  const toggleShowAllInvites = useCallback(() => {
    setShowAllInvites((prev) => !prev);
  }, []);

  const handleDeleteInvite = useCallback((item: InviteItem) => {
    setSelectedInviteItem(item);
    setIsDeleteModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedInviteItem) {
      await deleteInvite(selectedInviteItem);
      setIsDeleteModalVisible(false);
      setSelectedInviteItem(null);
    }
  }, [selectedInviteItem, deleteInvite]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteModalVisible(false);
    setSelectedInviteItem(null);
  }, []);

  const isNameChanged = organizationName !== (organisation?.name || '');

  const organisationCardRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('referrer') === 'invite' && organisationCardRef.current) {
      organisationCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchParams]);

  return (
    <div id={ORGANISATION_CARD_SECTION_ID} ref={organisationCardRef}>
      <CrPaper className="organisation-card">
        <div className="header-wrapper">
          <h2 className="header-wrapper-title">{notificationText.organisation.title}</h2>
        </div>
        <div className="form-wrapper">
          <div className="form-inner-wrapper">
            <Form
              form={organizationForm}
              name="organization"
              layout="vertical"
              onFinish={handleOrganizationSubmit}
              onValuesChange={handleNameChange}
              initialValues={{ name: organisation?.name || '' }}
            >
              <Form.Item
                name="name"
              >
                <CrInput
                  id="settings-global-email"
                  name="name"
                  placeholder={
                    !organisation?.name ? 'Set your institutional name' : 'Enter institutional name'
                  }
                />
              </Form.Item>
              {nameFormMessage && (
                <div
                  className={classNames({
                    'form-message-success': nameFormMessage.type == 'success',
                    'form-message-error': nameFormMessage.type === 'error',
                  })}
                >
                  {nameFormMessage.text}
                </div>
              )}
              {isNameChanged && !nameFormMessage && (
                <Form.Item>
                  <Button className="save-button" type="primary" htmlType="submit" loading={isUpdating}>
                    Save
                  </Button>
                </Form.Item>
              )}
            </Form>
          </div>
          <div className="main-warning-wrapper" />
        </div>

        <div className="form-wrapper">
          <div className="form-inner-wrapper">
            <form
              name="ror"
              onSubmit={handleRorSubmit}
              onChange={handleRorChange}
            >
              <div className="fields-wrapper">
                <div className="input-item">
                  <DropdownInput
                    id="ror-id"
                    label="ROR id"
                    name="ror_id"
                    isOpen={isIdOpen}
                    suggestions={suggestionsId}
                    handleOptionClick={handleRorOptionClick('id')}
                    setRorName={setRorName}
                    setRorId={setRorId}
                    value={rorId}
                    onChange={handleRorInputChange('id')}
                  />
                </div>
                <div className="input-item">
                  <DropdownInput
                    id="ror-name"
                    label="ROR registered name"
                    name="rorName"
                    value={rorName}
                    suggestions={suggestionsName}
                    isOpen={isNameOpen}
                    onChange={handleRorInputChange('name')}
                    handleOptionClick={handleRorOptionClick('name')}
                    setRorName={setRorName}
                    setRorId={setRorId}
                  />
                </div>
              </div>
              {rorFormMessage && (
                <div
                  className={classNames({
                    'form-message-success': rorFormMessage.type === 'success',
                    'form-message-error': rorFormMessage.type === 'error',
                  })}
                  style={{ marginTop: '16px' }}
                >
                  {rorFormMessage.text}
                </div>
              )}
              {isRorChanged && !rorFormMessage && (
                <div style={{ marginTop: '16px' }}>
                  <Button className="save-button" type="primary" htmlType="submit" loading={isUpdating}>
                    Save
                  </Button>
                </div>
              )}
            </form>
          </div>
          <div className="main-warning-wrapper">{renderRORWarning()}</div>
        </div>

        <Markdown className="ror-description">
          {notificationText.organisation.rordescription}
        </Markdown>

        <div className="header-wrapper">
          <h2 className="header-wrapper-title">{notificationText.invite.title}</h2>
        </div>

        <div className="form-wrapper">
          <div className="form-inner-wrapper">
            <Form
              form={inviteForm}
              name="invitation"
              layout="vertical"
              onFinish={handleInviteSubmit}
              className="organisation-form"
            >
              <Form.Item
                name="email"
                className="input-input"
                rules={[
                  { required: true, message: 'Please enter an email address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <CrInput
                  id="settings-invitation"
                  name="email"
                  label="Email"
                />
              </Form.Item>
              <Form.Item className="form-item">
                <Button
                  className="invite-button"
                  type="primary"
                  htmlType="submit"
                  loading={isInviting}
                >
                  {notificationText.invite.buttonCaption}
                </Button>
              </Form.Item>
            </Form>

            <h4 className="invite-list-title">{notificationText.invite.listAccess}</h4>
            <div className="invite-list">
              {isLoadingInvites ? (
                <div>Loading invites...</div>
              ) : displayedInviteCodes.length === 0 ? (
                <div>No invites found</div>
              ) : (
                <>
                  {displayedInviteCodes.map((item, index) => (
                    <div
                      key={`invite-${index}`}
                      className="invitation-user-delete"
                    >
                      <div
                        id={`invite-${item.email}`}
                        className="invite-email"
                      >
                        {item.email}
                      </div>
                      <div
                        id={`invite-${item.activated}`}
                        className={classNames('invite-status', {
                          'invite-activated': item.activated,
                        })}
                      >
                        {item.activated ? 'activated' : 'not activated'}
                      </div>
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteInvite(item)}
                      >
                        <DeleteFilled />
                      </Button>
                    </div>
                  ))}
                  {inviteCodes.length > 5 && (
                    <Button
                      className="show-btn"
                      type="default"
                      onClick={toggleShowAllInvites}
                    >
                      {showAllInvites ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="main-warning-wrapper" />
        </div>
        <ConfirmationDeleteInviteModal
          open={isDeleteModalVisible}
          item={selectedInviteItem}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={isDeleting}
        />
      </CrPaper>
    </div>
  );
};
