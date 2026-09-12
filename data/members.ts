// ─────────────────────────────────────────────────────────────────────────────
// data/members.ts  — Two sections: Mandram (club) and Kalloori (college)
// ─────────────────────────────────────────────────────────────────────────────

export interface Member {
  id: string;
  name: string;
  nameTamil: string;
  photo: string;
  role: string;
  roleTamil: string;
}

export interface MemberGroup {
  groupId: string;
  groupName: string;       // English
  groupNameTamil: string;  // Tamil
  members: Member[];
}

export const memberGroups: MemberGroup[] = [
  {
    groupId: "mandram",
    groupName: "Club Committee — Mandram",
    groupNameTamil: "மன்றக் குழு",
    members: [
      {
        id: "bevina",
        name: "Bevina",
        nameTamil: "பெவினா",
        photo: "/images/members/member-1.jpg",
        role: "President",
        roleTamil: "தலைவர்",
      },
      {
        id: "semozhi",
        name: "Semozhi",
        nameTamil: "செம்மொழி",
        photo: "/images/members/member-2.jpg",
        role: "Secretary",
        roleTamil: "செயலர்",
      },
      {
        id: "revathi",
        name: "Revathi",
        nameTamil: "ரேவதி",
        photo: "/images/members/member-3.jpg",
        role: "Treasurer",
        roleTamil: "பொருளாளர்",
      },
    ],
  },
  {
    groupId: "kalloori",
    groupName: "College — Kalloori",
    groupNameTamil: "கல்லூரி",
    members: [
      {
        id: "advisor1",
        name: "Student Advisor 1",
        nameTamil: "மாணவர் ஆலோசகர் 1",
        photo: "/images/members/member-4.jpg",
        role: "Student Advisor",
        roleTamil: "மாணவர் ஆலோசகர்",
      },
      {
        id: "advisor2",
        name: "Student Advisor 2",
        nameTamil: "மாணவர் ஆலோசகர் 2",
        photo: "/images/members/member-5.jpg",
        role: "Student Advisor",
        roleTamil: "மாணவர் ஆலோசகர்",
      },
      {
        id: "dean",
        name: "Dean",
        nameTamil: "டீன்",
        photo: "/images/members/member-6.jpg",
        role: "Dean of Student Affairs",
        roleTamil: "மாணவர் நலன் டீன்",
      },
    ],
  },
];
