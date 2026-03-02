import { useDocumentTitle } from '@hooks/useDocumentTitle';

export function MembershipPage() {
  useDocumentTitle('Membership');

  return (
    <div>
      <h1>Membership</h1>
      <p>This is the membership page content.</p>
    </div>
  );
}

