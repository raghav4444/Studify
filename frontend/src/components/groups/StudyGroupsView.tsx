import React from "react";
import { Users, PlusCircle, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
// import CreateGroupModal from "./CreateGroupModal";

interface Group {
  id: string;
  name: string;
  members: string[];
  description: string;
}

interface StudyGroupsViewProps {
  groups: Group[];
  onCreateGroup: () => void;
  isCreateGroupModalOpen: boolean;
  closeCreateGroupModal: () => void;
  handleCreateGroup: (group: Group) => void;
  openCreateGroupModal: () => void;
}

const CreateGroupModal = () => null; // Fallback for missing modal

const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  groups,
  onCreateGroup,
  isCreateGroupModalOpen,
  closeCreateGroupModal,
  handleCreateGroup,
  openCreateGroupModal,
}) => {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
      {/* Animated glowing header */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-2 animate-pulse">
          <Users
            size={48}
            className="text-blue-400 drop-shadow-[0_0_24px_rgba(59,130,246,0.8)]"
          />
        </div>
        <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.7)] mb-1 tracking-tight">
          Study Groups
        </h2>
        <p className="text-blue-200 text-lg font-medium drop-shadow mb-2">
          "Collaboration breeds success!"
        </p>
      </div>
      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="backdrop-blur bg-gray-800/60 border border-blue-500/30 shadow-lg hover:shadow-blue-500/30 hover:border-blue-500/60 transition-all duration-300 rounded-2xl"
          >
            <CardHeader className="flex items-center gap-3">
              <Users
                className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse"
                size={32}
              />
              <CardTitle className="text-white text-xl font-semibold tracking-tight">
                {group.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-blue-200 mb-2 text-base">
                {group.description}
              </div>
              <div className="flex -space-x-2 mb-2">
                {group.members.map((member, idx) => (
                  <img
                    key={idx}
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      member
                    )}&background=1e293b&color=60a5fa&size=48`}
                    alt={member}
                    className="w-8 h-8 rounded-full border-2 border-blue-500/40 shadow"
                  />
                ))}
              </div>
              <Button className="mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow hover:shadow-blue-500/25 transition-all duration-300 w-full rounded-lg font-semibold tracking-tight">
                Join Group
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-pulse">
        <Button
          onClick={openCreateGroupModal}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-full px-6 py-3 text-lg font-bold"
        >
          <Plus size={24} className="mr-2" />
          Create Group
        </Button>
      </div>
      {/* Create Group Modal (not implemented in fallback) */}
    </div>
  );
};

export default StudyGroupsView;
