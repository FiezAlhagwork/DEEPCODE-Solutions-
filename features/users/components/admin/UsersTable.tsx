"use client";

import { useState } from "react";
import { Search, ShieldCheck, UserRound, UserX } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import RoleBadge from "@/components/admin/RoleBadge";
import Avatar from "@/components/admin/ui/Avatar";
import Button from "@/components/admin/ui/Button";
import DataTable, { PrimaryCell } from "@/components/admin/ui/DataTable";
import EmptyState from "@/components/admin/ui/EmptyState";
import IconButton from "@/components/admin/ui/IconButton";
import Modal from "@/components/admin/ui/Modal";
import Pagination from "@/components/admin/ui/Pagination";
import { Panel } from "@/components/admin/ui/Panel";
import SelectInput from "@/components/admin/ui/SelectInput";
import TableState from "@/components/admin/ui/TableState";
import TableToolbar from "@/components/admin/ui/TableToolbar";
import TextInput from "@/components/admin/ui/TextInput";
import Tooltip from "@/components/admin/ui/Tooltip";
import { useDeactivateUser, useUsers } from "@/features/users/hooks/UseUsers";
import type {
  AdminUser,
  UsersTableProps,
  UserTableFilters,
} from "@/features/users/types/Users";
import { fullName } from "@/features/users/utils/Users";
import { useConfirmedAction } from "@/hooks/UseConfirmedAction";
import { useListControls } from "@/hooks/UseListControls";
import type { Column } from "@/types/AdminUi";
import ChangeRoleModal from "./ChangeRoleModal";

// Searching, filtering and paging all happen on the server, same as the
// projects and categories grids: filtering the page already on screen would
// report "no matches" for a teammate who is simply on another page.
//
// There is no status column. `GET /api/users` filters `status: "active"` and
// offers no way to ask for anything else, so the value would read "active" on
// every row forever — and a deactivated account leaves the list entirely,
// which is the confirmation the action needs.
export default function UsersTable({ canManage, viewerId }: UsersTableProps) {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("admin.common");
  const format = useFormatter();

  const list = useListControls<UserTableFilters>({ role: "" });

  const [pendingRole, setPendingRole] = useState<AdminUser | null>(null);

  const usersQuery = useUsers(list.params);
  const deactivateUser = useDeactivateUser();
  const deactivate = useConfirmedAction(
    deactivateUser,
    (user: AdminUser) => user._id,
  );

  const rows = usersQuery.data?.data ?? [];
  const pagination = usersQuery.data?.pagination;

  /**
   * Why a row's actions are withheld, or `undefined` when they are available.
   * Doubles as the tooltip label, so the button is never just inert with no
   * explanation.
   */
  function blockedReason(user: AdminUser) {
    if (!canManage) return t("superAdminOnly");
    if (user._id === viewerId) return t("selfActionHint");
    return undefined;
  }

  const columns: Column<AdminUser>[] = [
    {
      id: "name",
      header: t("table.name"),
      cell: (user) => (
        <PrimaryCell
          media={<Avatar name={fullName(user)} imageUrl={user.imageUrl} />}
          title={fullName(user)}
          subtitle={user.email}
        />
      ),
    },
    {
      id: "role",
      header: t("table.role"),
      className: "w-36",
      cell: (user) => <RoleBadge role={user.role} />,
    },
    {
      id: "joined",
      header: t("table.joined"),
      className: "w-36",
      cell: (user) => (
        <span className="text-ink-muted">
          {format.dateTime(new Date(user.createdAt), {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <>
      <Panel flush>
        <TableToolbar
          search={
            <TextInput
              icon={Search}
              value={list.search}
              onChange={(event) => list.setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
            />
          }
          filters={
            <SelectInput
              value={list.filters.role}
              onChange={(event) =>
                // The options below are the only values this can produce.
                list.setFilter(
                  "role",
                  event.target.value as UserTableFilters["role"],
                )
              }
              aria-label={t("table.role")}
              className="w-40"
            >
              <option value="">{t("allRoles")}</option>
              <option value="super_admin">{tCommon("roleSuperAdmin")}</option>
              <option value="admin">{tCommon("roleAdmin")}</option>
              <option value="user">{tCommon("roleUser")}</option>
            </SelectInput>
          }
          // The disabled buttons carry a tooltip, but tooltips are hidden below
          // `md` (a touch screen has no hover), so a plain admin would meet
          // three dead buttons with no reason given. This line always shows.
          trailing={
            canManage ? undefined : (
              <span className="text-xs text-ink-faint">
                {t("superAdminOnly")}
              </span>
            )
          }
        />

        <TableState
          isLoading={usersQuery.isPending && !usersQuery.data}
          error={usersQuery.error}
          icon={UserRound}
        >
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(user) => user._id}
            actionsLabel={tCommon("actions")}
            empty={
              <EmptyState
                icon={UserRound}
                title={list.isFiltered ? tCommon("noMatches") : t("emptyTitle")}
                description={
                  list.isFiltered
                    ? tCommon("noMatchesHint")
                    : t("emptyDescription")
                }
                action={
                  list.isFiltered ? (
                    <Button variant="outline" size="sm" onClick={list.reset}>
                      {tCommon("clearFilters")}
                    </Button>
                  ) : undefined
                }
              />
            }
            rowActions={(user) => {
              const reason = blockedReason(user);

              return (
                <>
                  <Tooltip
                    label={reason ?? t("changeRole")}
                    side="start"
                    enabled={reason !== undefined}
                  >
                    <IconButton
                      size="sm"
                      aria-label={t("changeRole")}
                      disabled={reason !== undefined}
                      onClick={() => setPendingRole(user)}
                    >
                      <ShieldCheck aria-hidden />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    label={reason ?? t("deactivate")}
                    side="start"
                    enabled={reason !== undefined}
                  >
                    <IconButton
                      size="sm"
                      variant="danger"
                      aria-label={t("deactivate")}
                      disabled={
                        reason !== undefined || user.status === "deactivated"
                      }
                      onClick={() => deactivate.ask(user)}
                    >
                      <UserX aria-hidden />
                    </IconButton>
                  </Tooltip>
                </>
              );
            }}
          />

          {rows.length > 0 && pagination && (
            <Pagination
              page={pagination.page}
              limit={list.limit}
              total={pagination.total}
              totalPages={pagination.totalPages}
              onPageChange={list.setPage}
              onLimitChange={list.setLimit}
            />
          )}
        </TableState>
      </Panel>

      {/* Keyed by the selected user so opening a different row remounts the
          modal and re-seeds its select from that user's current role. */}
      <ChangeRoleModal
        key={pendingRole?._id ?? "none"}
        user={pendingRole}
        onClose={() => setPendingRole(null)}
      />

      {/* Its own `Modal` rather than `DeleteConfirmDialog` — the copy is about
          suspending an account, not deleting a record — but the state and the
          two rules behind it (no dismiss mid-flight, close on success only)
          are the same ones `useConfirmedAction` owns for the other tables. */}
      <Modal
        open={deactivate.target !== null}
        onClose={deactivate.dismiss}
        closeLabel={tCommon("cancel")}
        title={t("deactivateTitle")}
        description={
          deactivate.target
            ? `${fullName(deactivate.target)} — ${t("deactivateDescription")}`
            : undefined
        }
        footer={
          <>
            <Button
              variant="ghost"
              disabled={deactivate.isPending}
              onClick={deactivate.dismiss}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              variant="danger"
              loading={deactivate.isPending}
              onClick={deactivate.confirm}
            >
              {t("deactivate")}
            </Button>
          </>
        }
      />
    </>
  );
}
